(async function () {
  const status = (msg) => {
    document.getElementById('status').textContent += `\n${new Date().toLocaleTimeString()}  ${msg}`;
  };

  const siteConfigResp = await fetch('/_data/theme.yml').catch(()=>null);
  status('Admin UI loaded.');

  // Simple GitHub OAuth (code exchange via Worker)
  const loginBtn = document.getElementById('loginBtn');
  loginBtn?.addEventListener('click', () => {
    const clientId = 'Ov23liqsljSBAqajz2eu';
    const redirectUri = window.location.origin + '/admin/';
    const scope = 'repo';
    const state = Math.random().toString(36).slice(2);
    localStorage.setItem('gh_oauth_state', state);
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`;
    window.location.href = url;
  });

  // If redirected back with ?code=
  const params = new URLSearchParams(window.location.search);
  if (params.get('code')) {
    const code = params.get('code');
    const state = params.get('state');
    if (state !== localStorage.getItem('gh_oauth_state')) {
      status('OAuth state mismatch.');
    } else {
      status('Exchanging code for access token…');
      const worker = "https://gfw-oauth-exchange.eric-moon.workers.dev";
      const resp = await fetch(worker, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code })
      }).catch(err => ({ ok:false, statusText: err.message }));
      if (resp.ok) {
        const data = await resp.json();
        localStorage.setItem('gh_token', data.access_token || '');
        status('GitHub token stored.');
        // Clean URL
        window.history.replaceState({}, '', '/admin/');
      } else {
        status('Token exchange failed: ' + resp.statusText);
      }
    }
  }

  // Publish new post via n8n webhook
  document.getElementById('publishBtn')?.addEventListener('click', async () => {
    const lang = document.getElementById('lang').value;
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const payload = { lang, title, body };

    const resp = await fetch("https://n8n.gofunwith.com/webhook/new-post", {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
      credentials: 'omit'
    }).catch(err => ({ ok:false, statusText: err.message }));

    if (resp.ok) status('새 글 발행 요청 성공');
    else status('발행 요청 실패: ' + resp.statusText);
  });

  // Theme update
  document.getElementById('themeUpdateBtn')?.addEventListener('click', async () => {
    const resp = await fetch("https://n8n.gofunwith.com/webhook/update-theme", { method: 'POST' })
      .catch(err => ({ ok:false, statusText: err.message }));
    if (resp.ok) status('_data/theme.yml 동기화 요청 성공');
    else status('동기화 실패: ' + resp.statusText);
  });

  // Translate
  document.getElementById('translateBtn')?.addEventListener('click', async () => {
    const text = document.getElementById('srcKo').value;
    const resp = await fetch("https://n8n.gofunwith.com/webhook/translate-post", {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ source_lang: 'ko', target_lang: 'en', text })
    }).catch(err => ({ ok:false, statusText: err.message }));
    if (resp.ok) {
      const data = await resp.json().catch(()=>({}));
      document.getElementById('translateOut').textContent = data.translated || JSON.stringify(data, null, 2);
      status('번역 요청 완료');
    } else {
      status('번역 실패: ' + resp.statusText);
    }
  });
})();
