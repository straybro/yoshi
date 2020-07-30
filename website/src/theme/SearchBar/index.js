import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import { DocSearchButton, useDocSearchKeyboardEvents } from '@docsearch/react';

let DocSearchModal = null;
let algoliasearch = null;

function Hit({ hit, children }) {
  return <Link to={hit.url}>{children}</Link>;
}

function DocSearch(props) {
  // const { siteMetadata } = useDocusaurusContext();
  const { withBaseUrl } = useBaseUrlUtils();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([
      import('algoliasearch/dist/algoliasearch-lite.esm.browser'),
      import('@docsearch/react/modal'),
      import('@docsearch/react/style'),
      import('./styles.css'),
    ]).then(([algoliasearchLite, { DocSearchModal: Modal }]) => {
      DocSearchModal = Modal;
      algoliasearch = algoliasearchLite.default;
    });
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded, setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  return (
    <>
      <Head>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin
        />
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            navigator={{
              navigate({ suggestionUrl }) {
                history.push(suggestionUrl);
              },
            }}
            transformItems={(items) => {
              return items.map((item) => {
                // We transform the absolute URL into a relative URL.
                // Alternatively, we can use `new URL(item.url)` but it's not
                // supported in IE.
                const a = document.createElement('a');
                a.href = item.url;

                return {
                  ...item,
                  url: withBaseUrl(`${a.pathname}${a.hash}`),
                };
              });
            }}
            hitComponent={Hit}
            resultsFooterComponent={() => <></>}
            transformSearchClient={() => {
              const { path, protocol } =
                process.env.NODE_ENV === 'production'
                  ? { path: '/doc-search', protocol: 'https' }
                  : { path: '', protocol: 'http' };
              return algoliasearch('', '', {
                hosts: [{ url: location.host + path, protocol }],
              });
            }}
            {...props}
          />,
          document.body,
        )}
    </>
  );
}

function SearchBar() {
  const { siteConfig = {} } = useDocusaurusContext();

  if (!siteConfig.themeConfig.algolia) {
    // eslint-disable-next-line no-console
    console.warn(`DocSearch requires an \`algolia\` field in your \`themeConfig\`.

See: https://v2.docusaurus.io/docs/search/#using-algolia-docsearch`);

    return null;
  }

  return <DocSearch {...siteConfig.themeConfig.algolia} />;
}

export default SearchBar;
