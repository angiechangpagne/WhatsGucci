//Service workers allow faster app load on subsequence production mode
//allows for offline capabilities
const isLocalhost = Boolean(
  window.location.hostname==='localhost' || 
    window.location.hostname ==== '[::1]' ||

    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2]0-4][0-9]|[01]?[0-9]?)){3}$/
    )
);

type Config = {
  onSucess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if (process.env.NODE_ENV=== 'production' && 'serviceWorker' in navigator){
    const publicUrl = new URL(
      (process as { env: { [key: string]: string } }).env.PUBLIC_URL,
      window.location.href
    );
    if(publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListender('load', ()=> {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost){
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a serice '+
            'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}


functiom registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const intstallingWorker = registration.installing;
        if(installingWorker == null) {
          return;
        }
        intstallingWorker.onstatechange = () => {
          if (intstallingWorker.state === 'installed'){
            if(navigator.serviceWorker.controller){
              console.log(
                 'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );

              if(config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              //offline cache
              console.log('Content is cached for offline use');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config){
  fetch(swUrl)
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null & contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log(
        'No internet bro.But App will run offline '
      );
    });
}

export function unregister() {
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}