(function () {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('cc--darkmode');
  }

  var config = {
    guiOptions: {
      consentModal: {
        equalWeightButtons: false
      }
    },
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      analytics: {
        enabled: false
      }
    },
    language: {
      default: 'en',
      translations: {
        en: {
          consentModal: {
            title: 'We use cookies',
            description: 'This site uses cookies for analytics and to improve your experience.',
            acceptAllBtn: 'Accept',
            acceptNecessaryBtn: 'Reject'
          }
        }
      }
    }
  };

  if (/^localhost$|^127\.0\.0\.1$/i.test(location.hostname)) {
    config.cookie = { secure: false };
  }

  function run() {
    CookieConsent.run(config);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}());
