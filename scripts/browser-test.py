# Fase B browser test: all 22 routes on 390x844 and 1280x900.
# Usage: npm run build && npx astro preview --port 4391  (other shell), then
#        [SCREENS_OUT=.screens/faseC/test] python3 scripts/browser-test.py [base-url]
# Never places a booking. Output in .screens/faseB/ (gitignored).
from playwright.sync_api import sync_playwright
import json, datetime, urllib.parse, sys, os

BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:4391'
# output folder: SCREENS_OUT=.screens/faseC/test (default .screens/faseB, so earlier rounds are not overwritten)
OUT = (os.environ.get('SCREENS_OUT') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.screens', 'faseB')).rstrip('/') + '/'
os.makedirs(OUT, exist_ok=True)

ROUTES = ['/', '/verblijf/', '/verblijf/kampeerplaats/', '/verblijf/kampeerplaats-prive-sanitair/',
          '/verblijf/glampingtent/', '/verblijf/trekkershut/', '/camperplaats/', '/camping/', '/faciliteiten/',
          '/horeca/', '/omgeving/', '/tarieven/', '/beschikbaarheid/', '/reserveren/', '/bevestiging/',
          '/over-ons/', '/contact/', '/veelgestelde-vragen/', '/privacy/', '/cookies/', '/algemene-voorwaarden/',
          '/bestaat-niet/']  # the last one serves the 404 page
WIDGETS = {'/beschikbaarheid/': 'searchpage', '/reserveren/': 'reservation', '/tarieven/': 'matrix'}
DETAILS = {'/verblijf/kampeerplaats/': (153224, 'Kampeerplaats'), '/verblijf/kampeerplaats-prive-sanitair/': (153221, 'Kampeerplek met prive sanitair'),
           '/verblijf/glampingtent/': (153215, 'Glampingtent met sanitair'), '/verblijf/trekkershut/': (153212, 'Trekkershut'),
           '/camperplaats/': (153218, 'Camperplaats')}
FULL = {'/', '/verblijf/', '/verblijf/glampingtent/', '/horeca/', '/omgeving/', '/over-ons/', '/beschikbaarheid/', '/reserveren/'}
NO_STICKY = {'/beschikbaarheid/', '/reserveren/', '/bevestiging/'}

results, fails = [], []
def check(name, ok, detail=''):
    (results if ok else fails).append(f"{'PASS' if ok else 'FAIL'} {name} {detail}".strip())

def slug(route):
    return 'home' if route == '/' else route.strip('/').replace('/', '-')

def scroll_through(page):
    page.evaluate('async () => { for (let y = 0; y < document.body.scrollHeight; y += 450) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } window.scrollTo(0, 0); }')
    page.wait_for_timeout(500)

arr = (datetime.date.today() + datetime.timedelta(days=14)).isoformat()
dep = (datetime.date.today() + datetime.timedelta(days=16)).isoformat()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for label, vp in [('mobiel', {'width': 390, 'height': 844}), ('desktop', {'width': 1280, 'height': 900})]:
        ctx = browser.new_context(viewport=vp, locale='nl-NL')
        for route in ROUTES:
            page = ctx.new_page()
            errors, scripts = [], []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(f'pageerror: {e}'))
            page.on('request', lambda r: scripts.append(r.url) if r.url.endswith('.js') and 'tommbooking' in r.url else None)
            resp = page.goto(BASE + route)
            page.wait_for_load_state('networkidle')
            name = f'{label} {route}'
            if route == '/bestaat-niet/':
                check(f'{name} geeft 404', resp.status == 404, str(resp.status))
                errors = [e for e in errors if '404' not in e]
            # widget pages: matrix must not load before scrolling
            w = WIDGETS.get(route)
            if w == 'matrix':
                # lazy: the script may only load before scrolling when the block is within view + 400px
                top = page.evaluate("() => document.querySelector('[data-tommy-widget]').getBoundingClientRect().top - innerHeight")
                loaded = any('matrix.js' in s for s in scripts)
                if top > 400:
                    check(f'{name} matrix nog niet geladen voor scrollen', not loaded, str(scripts))
                else:
                    check(f'{name} matrix in beeld en direct geladen', loaded, f'top-offset {round(top)}')
            page.screenshot(path=f'{OUT}{slug(route)}-{label}-boven.png')
            scroll_through(page)
            if route == '/beschikbaarheid/':
                # without a search in the URL only our block is shown; Tommy's script is not loaded
                check(f'{name} zonder zoekopdracht: geen widget en geen Tommy-script', page.locator('[data-tommy-widget]').is_hidden() and not any('searchpage.js' in s for s in scripts) and page.locator('.reserve [data-date-search]').is_visible(), str(scripts))
                w = None
            if w:
                page.locator('[data-tommy-widget]').scroll_into_view_if_needed()
                try:
                    page.wait_for_function("() => { const el = document.querySelector('[data-tommy-widget]'); return el && el.children.length > 0 && el.innerText.trim().length > 20; }", timeout=20000)
                    ok = True
                except Exception:
                    ok = False
                check(f'{name} widget {w} zichtbaar', ok and page.locator('[data-tommy-widget]').is_visible())
                page.wait_for_timeout(800)
            if route in FULL:
                page.screenshot(path=f'{OUT}{slug(route)}-{label}-volledig.png', full_page=True)
            h1 = page.locator('h1').count()
            check(f'{name} één h1', h1 == 1, str(h1))
            no_alt = page.eval_on_selector_all('img', 'els => els.filter(e => !e.hasAttribute("alt") && !e.closest("[data-tommy-widget]")).length')
            check(f'{name} alt overal', no_alt == 0, str(no_alt))
            overflow = page.evaluate('() => document.documentElement.scrollWidth - window.innerWidth')
            check(f'{name} geen overloop', overflow <= 0, str(overflow))
            if label == 'mobiel':
                has_bar = page.locator('[data-sticky-bar]').count() > 0
                check(f'{name} sticky balk {"afwezig" if route in NO_STICKY else "aanwezig"}', has_bar != (route in NO_STICKY))
            check(f'{name} geen consolefouten', not errors, ' | '.join(errors[:3]))
            page.close()

        # date search on home and verblijf links to /beschikbaarheid/ with the right parameters
        for route in ['/', '/verblijf/']:
            page = ctx.new_page()
            page.goto(BASE + route); page.wait_for_load_state('networkidle')
            form = page.locator('[data-date-search]').first
            form.scroll_into_view_if_needed()
            form.locator('[name="arrival-date"]').fill(arr)
            form.locator('[name="arrival-date"]').dispatch_event('change')
            form.locator('[name="kinderen"]').fill('1')
            with page.expect_navigation():
                form.locator('button[type="submit"]').click()
            u = urllib.parse.urlparse(page.url); q = urllib.parse.parse_qs(u.query)
            ac = json.loads(q.get('age-category', ['[]'])[0])
            check(f'{label} datumkiezer {route} -> /beschikbaarheid/', u.path == '/beschikbaarheid/' and q.get('arrival-date') == [arr]
                  and q.get('departure-date') == [dep] and ac == [{'id': 39767, 'pax': 2}, {'id': 39764, 'pax': 1}], page.url.split('?')[-1])
            page.wait_for_load_state('networkidle')
            try:
                page.wait_for_function("() => /Resultaten \\(\\d+\\)/.test(document.querySelector('[data-tommy-widget]').innerText)", timeout=20000)
                t = page.inner_text('[data-tommy-widget]')
                ok = (page.locator('.reserve [name="arrival-date"]').input_value() == arr and page.locator('.reserve [name="kinderen"]').input_value() == '1'
                      and page.locator('.t3-search-bar').first.is_hidden() and 'beschikbaar' in t)
                check(f'{label} na {route}: ons blok voorgevuld, Tommy-balk weg, resultaten', ok)
            except Exception as e:
                check(f'{label} widget vult velden na {route}', False, str(e)[:80])
            style = page.evaluate('''() => { const w = document.querySelector('[data-tommy-widget]');
              const b = [...w.querySelectorAll('a,button')].find(e => e.innerText.trim().startsWith('Boeken'));
              return b ? [getComputedStyle(b).backgroundColor, getComputedStyle(b).fontFamily] : null; }''')
            check(f'{label} widget huisstijl na {route}', bool(style) and style[0] == 'rgb(34, 66, 43)' and style[1].startswith('Lato'), str(style))
            page.close()

        # booking chain: price cell -> popover in view -> Boeken -> /reserveren/ on step "Uw gegevens" (nothing filled in)
        def reserve_step(page):
            page.wait_for_load_state('networkidle')
            page.wait_for_function("() => document.querySelector('[data-tommy-widget] .t3-step-active')", timeout=20000)
            return page.inner_text('[data-tommy-widget] .t3-step-active').strip()

        # detail pages: Reserveren block -> /beschikbaarheid/?verblijf=<id> with only that accommodation -> Boeken -> its reservation
        for route, (acc_id, tommy_name) in DETAILS.items():
            page = ctx.new_page()
            page.goto(BASE + route); page.wait_for_load_state('networkidle')
            check(f'{label} {route} geen Tommy-code op de detailpagina', page.locator('[data-tommy-widget]').count() == 0)
            form = page.locator('#beschikbaarheid [data-date-search]')
            form.scroll_into_view_if_needed()
            title = form.locator('h2').inner_text()
            form.locator('[name="arrival-date"]').fill(arr)
            form.locator('[name="arrival-date"]').dispatch_event('change')
            with page.expect_navigation():
                form.locator('button[type="submit"]').click()
            page.wait_for_load_state('networkidle')
            q = urllib.parse.parse_qs(urllib.parse.urlparse(page.url).query)
            check(f'{label} {route} blok "{title}" -> /beschikbaarheid/ met verblijf={acc_id}', urllib.parse.urlparse(page.url).path == '/beschikbaarheid/' and q.get('verblijf') == [str(acc_id)] and title.startswith('Reserveer deze'), page.url.split('?')[-1][:120])
            page.wait_for_function("() => /Resultaten \\(\\d+\\)/.test(document.querySelector('[data-tommy-widget]').innerText)", timeout=20000)
            page.wait_for_timeout(800)
            t = page.inner_text('[data-tommy-widget]')
            note = page.locator('[data-filter-note]').inner_text() if page.locator('[data-filter-note]').is_visible() else ''
            check(f'{label} {route} alleen dit verblijf in de resultaten', 'Resultaten (1)' in t and tommy_name in t and 'Je ziet alleen' in note, t[:80].replace(chr(10), ' '))
            page.screenshot(path=f'{OUT}detail-naar-beschikbaarheid-{slug(route)}-{label}.png')
            boek = page.locator('[data-tommy-widget] a:has-text("Boeken")').first
            boek.scroll_into_view_if_needed()
            with page.expect_navigation():
                boek.click()
            step = reserve_step(page)
            q = urllib.parse.parse_qs(urllib.parse.urlparse(page.url).query)
            # on phones Tommy collapses the summary below the form: read textContent, which includes it
            summary = page.evaluate("() => document.querySelector('[data-tommy-widget]').textContent")
            check(f'{label} {route} Boeken -> reservering van precies dit verblijf, op Uw gegevens', q.get('accommodation') == [str(acc_id)] and step == 'Uw gegevens' and tommy_name in summary and '2x Volwassenen' in summary, f'{step} {q.get("accommodation")}')
            page.screenshot(path=f'{OUT}detail-reservering-{slug(route)}-{label}.png')
            page.close()

        for route in ['/tarieven/']:
            page = ctx.new_page()
            page.goto(BASE + route); page.wait_for_load_state('networkidle')
            page.locator('[data-tommy-widget]').scroll_into_view_if_needed()
            page.wait_for_function("() => document.querySelector('[data-tommy-widget] .t3-stay-day:not(.disabled) .sale-price')", timeout=20000)
            page.wait_for_timeout(600)
            page.wait_for_function("() => /2 personen/.test(document.querySelector('[data-tommy-widget]').innerText)", timeout=10000)
            check(f'{label} {route} matrix staat standaard op 2 personen', True)
            page.locator('.t3-stay-day:not(.disabled) .sale-price').first.click()
            page.wait_for_timeout(700)
            check(f'{label} {route} popover toont 2 personen', '2 personen' in page.inner_text('.t3-matrix-popover'))
            boek = page.locator('.t3-matrix-popover a:has-text("Boeken")')
            box = boek.bounding_box() if boek.count() else None
            in_view = bool(box) and box['y'] >= 0 and box['y'] + box['height'] <= vp['height']
            check(f'{label} {route} prijsklik toont Boeken in beeld', in_view, str(box))
            page.screenshot(path=f'{OUT}matrix-popover-{slug(route)}-{label}.png')
            if in_view:
                with page.expect_navigation():
                    boek.click()
                step = reserve_step(page)
                q = urllib.parse.parse_qs(urllib.parse.urlparse(page.url).query)
                ages = json.loads(q.get('age-category', ['[]'])[0])
                check(f'{label} {route} Boeken -> /reserveren/ op Uw gegevens met 2 volwassenen en datums', urllib.parse.urlparse(page.url).path == '/reserveren/' and 'accommodation' in q
                      and 'arrival-date' in q and 'departure-date' in q and ages == [{'id': 39767, 'pax': 2}] and step == 'Uw gegevens', f'{step} {ages}')
                page.screenshot(path=f'{OUT}reserveren-na-matrix-{slug(route)}-{label}.png')
            page.close()

        # full chain: BOEK NU (header on desktop, sticky bar on mobile) -> our block on /beschikbaarheid/ ->
        # results with counts, Tommy's own bar hidden -> Boeken -> /reserveren/ on "Uw gegevens"
        page = ctx.new_page()
        page.goto(BASE + '/'); page.wait_for_load_state('networkidle')
        if label == 'desktop':
            cta = page.locator('.site-header__cta')
        else:
            page.mouse.wheel(0, 1500); page.wait_for_timeout(600)
            cta = page.locator('[data-sticky-bar] .sticky-bar__book')
        with page.expect_navigation():
            cta.click()
        page.wait_for_load_state('networkidle')
        form = page.locator('.reserve [data-date-search]')
        check(f'{label} BOEK NU -> /beschikbaarheid/ met ons blok', urllib.parse.urlparse(page.url).path == '/beschikbaarheid/' and form.is_visible(), page.url)
        page.wait_for_timeout(800)
        check(f'{label} zonder parameters: alleen ons blok, geen widget', page.locator('[data-tommy-widget]').is_hidden() and page.locator('.t3-search-bar').count() == 0)
        page.screenshot(path=f'{OUT}beschikbaarheid-zonder-zoekopdracht-{label}.png')
        form.locator('[name="arrival-date"]').fill(arr)
        form.locator('[name="arrival-date"]').dispatch_event('change')
        form.locator('[name="volwassenen"]').fill('3')
        with page.expect_navigation():
            form.locator('button[type="submit"]').click()
        page.wait_for_load_state('networkidle')
        page.wait_for_function("() => /Resultaten \\(\\d+\\)/.test(document.querySelector('[data-tommy-widget]').innerText)", timeout=20000)
        page.wait_for_timeout(800)
        t = page.inner_text('[data-tommy-widget]')
        prefilled = page.locator('.reserve [name="arrival-date"]').input_value() == arr and page.locator('.reserve [name="volwassenen"]').input_value() == '3'
        check(f'{label} ons blok voorgevuld uit de URL', prefilled)
        check(f'{label} Tommy-balk verborgen bij zoekopdracht', page.locator('.t3-search-bar').first.is_hidden())
        check(f'{label} resultaten met aantallen', 'Resultaten (' in t and 'beschikbaar' in t, t[:60].replace(chr(10), ' '))
        page.screenshot(path=f'{OUT}beschikbaarheid-met-zoekopdracht-{label}.png', full_page=True)
        boek = page.locator('[data-tommy-widget] a:has-text("Boeken")').first
        boek.scroll_into_view_if_needed()
        check(f'{label} /beschikbaarheid/ Boeken zichtbaar', boek.is_visible())
        with page.expect_navigation():
            boek.click()
        step = reserve_step(page)
        check(f'{label} /beschikbaarheid/ Boeken -> /reserveren/ op Uw gegevens', urllib.parse.urlparse(page.url).path == '/reserveren/' and step == 'Uw gegevens', step)
        page.screenshot(path=f'{OUT}reserveren-na-beschikbaarheid-{label}.png')
        page.close()

        # contact form: empty submit is refused, filled submit shows the message
        page = ctx.new_page()
        page.goto(BASE + '/contact/'); page.wait_for_load_state('networkidle')
        page.locator('[data-contact-form] button[type="submit"]').click()
        check(f'{label} contactformulier weigert leeg', page.locator('[data-contact-status]').is_hidden())
        page.fill('#cf-name', 'Test'); page.fill('#cf-email', 'test@example.nl'); page.fill('#cf-message', 'Testbericht')
        page.locator('[data-contact-form] button[type="submit"]').click()
        page.wait_for_timeout(300)
        check(f'{label} contactformulier toont melding', page.locator('[data-contact-status]').is_visible())
        check(f'{label} contactformulier blijft op de pagina', urllib.parse.urlparse(page.url).path == '/contact/', page.url)
        page.screenshot(path=f'{OUT}contact-formulier-{label}.png')
        page.close()

        if label == 'mobiel':
            page = ctx.new_page()
            page.goto(BASE + '/'); page.wait_for_load_state('networkidle')
            page.click('[data-menu-open]'); page.wait_for_timeout(200)
            items = page.locator('#mobile-menu nav li a').count()
            check('mobiel menu open met acht items', page.is_visible('#mobile-menu') and items == 8, str(items))
            page.screenshot(path=f'{OUT}menu-mobiel.png')
            page.keyboard.press('Escape'); page.wait_for_timeout(200)
            check('mobiel menu sluit met Escape', not page.is_visible('#mobile-menu'))
            page.mouse.wheel(0, 1500); page.wait_for_timeout(600)
            check('mobiel sticky balk zichtbaar na hero', page.eval_on_selector('[data-sticky-bar]', 'e => e.classList.contains("is-visible")'))
            page.screenshot(path=f'{OUT}home-mobiel-sticky.png')
            page.close()
        else:
            page = ctx.new_page()
            page.goto(BASE + '/'); page.wait_for_load_state('networkidle')
            nav = page.locator('.primary-nav a').count()
            wrapped = page.eval_on_selector_all('.primary-nav a, .site-header__cta', 'els => els.filter(e => e.getBoundingClientRect().height > 60).length')
            check('desktop menu acht items op één regel plus BOEK NU', nav == 8 and wrapped == 0 and page.is_visible('.site-header__cta'), f'{nav} {wrapped}')
            page.close()

        cookies = [c['name'] for c in ctx.cookies()]
        check(f'{label} geen _ga-cookies na alle pagina\'s', not any(c.startswith('_ga') for c in cookies), str(cookies))
        ctx.close()
    browser.close()

with open(OUT + 'result.txt', 'w') as f:
    f.write('\n'.join(results + fails) + f"\n{len(results)} PASS, {len(fails)} FAIL\n" + ('ALL OK' if not fails else f'{len(fails)} FAILED') + '\n')
print('\n'.join(fails))
print(f'{len(results)} PASS, {len(fails)} FAIL')
print('ALL OK' if not fails else f'{len(fails)} FAILED')
