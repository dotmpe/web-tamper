// ==UserScript==
// @name         GitHub Tweaks
// @namespace    dotmpe.com
// @grant        GM_addStyle
// @version      0.1-dev
// @description  Wide pages: remove max-width for graphs, and add 200px to other pages.
// @author       hari
// @match        https://github.com/*
// @grant        GM_addStyle
// updateURL
// ==/UserScript==
(function() {
  console.log("github.mpe");

  GM_addStyle(`

/* Some GitHub pages benefit from some horizontal spave, removing width restriction for graphs etc. Also making other (text) pages a bit wider. */

.mpe__fullwidth .container-xl { max-width: none; }
.container-xl { max-width: 1480px; }
`);

  // If in project context, set `purl` to project base-url
  var purl = null;
  if ((window.location.pathname.match(/\//g) || []).length >= 2) {
    var ppath = window.location.pathname.split('/').slice(0, 3).join('/');
    purl = window.location.protocol+'//'+window.location.host+ppath;
  }

  // Add shortcuts
  // Direct header link to fork network graph
  function mpe_gh_p_add_header_link (path_suffix, label)
  {
    var span = document.createElement('span');
    span.innerText = label;

    var a = document.createElement('a');
    a.className = "UnderlineNav-item hx_underlinenav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item";
    a.href = purl +"/"+ path_suffix;

    a.append(span)

    var li = document.createElement('li');
    li.className = "d-inline-flex";
    li.append(a);

    var list = document.querySelector('#repository-container-header nav ul');
    list.append(li);
  }

  if (purl != null) {
    // TODO: testing, move to update handler when working...
    mpe_gh_p_add_header_link("network", "Network");
  }


  // Direct link to new repo dialog
  // XXX: can we create a keyboard shortcut as well?

  function mpe_gh_new ()
  {
    var div = document.createElement('div');
    div.className = "d-none d-md-flex flex-md-items-center flex-md-justify-end";
    div.innerHTML = `
      <a href="/new" class="text-center btn btn-primary ml-3">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo">
      <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
      </svg>
      New
      </a>
`;
    div.style = "margin-right: 14px;";

    var x = document.querySelector("header > div.Header-item.mr-0.mr-md-3.flex-order-1.flex-md-order-none");
    x.prepend(div);
  }

  // TODO: update properly after page-nav
  if (window.location.search != "?tab=repositories") {
    mpe_gh_new();
  }


  // On page-change handler and add (CSS) classes based on URL

  function mpe_update_page()
  {
    var body = document.getElementsByTagName('body')[0];
    if (window.location.href.match(/.*\/(graphs\/[\w-]+|network)$/)) {
      body.classList.add('mpe__fullwidth');
    } else {
      body.classList.remove('mpe__fullwidth');
    }

  }

  // Setup to listen for page changes

  var oldHref = document.location.href;

  window.onload = function() {
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href;
          mpe_update_page();
        }
      });
    });

    var config = {
      childList: true,
      subtree: true
    };

    observer.observe(bodyList, config);
  };

  mpe_update_page();

})()
