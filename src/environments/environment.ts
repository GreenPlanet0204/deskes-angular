// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {KeycloakConfig} from "keycloak-js";

const keycloakConfig: KeycloakConfig = {
  url: 'http://10.0.30.236:8280/auth',
  realm: 'DDESB',
  clientId: 'deskes7-apps'
};

export const environment = {
  production: false,
  local: true,
  api_url: 'http://localhost:8080/api/v1',
  elastic_url: 'http://localhost:8081/api/v1',
  websocket_url: 'ws://localhost:8080/socket',
  keycloakConfig,
  dodWarning: {
    title: 'Department of Defense (DoD) Notice and Consent',
    message:
      'You are accessing a U.S. Government (USG) Information System (IS) that is provided for USG-authorized use only.\n' +
      '\n' +
      'By using this IS (which includes any device attached to this IS), you consent to the following conditions:\n' +
      '\n' +
      '    The USG routinely intercepts and monitors communications on this IS for purposes including, but not limited to, penetration testing, COMSEC monitoring, network operations and defense, personnel misconduct (PM), law enforcement (LE), and counterintelligence (CI) investigations.\n' +
      '\n' +
      '    At any time, the USG may inspect and/or seize data stored on this IS.\n' +
      '\n' +
      '    Communications using, or data stored on, this IS are not private, are subject to routine monitoring, interception, and search, and may be disclosed or used for any USG-authorized purpose.\n' +
      '\n' +
      '    This IS includes security measures (e.g., authentication and access controls) to protect USG interests--not for your personal benefit or privacy.\n' +
      '\n' +
      '    Notwithstanding the above, using this IS does not constitute consent to PM, LE or CI investigative searching or monitoring of the content of privileged communications, or work product, related to personal representation or services by attorneys, psychotherapists, or clergy, and their assistants.  Such communications and work product are private and confidential.',
    okText: 'I Accept',
    cancelText: 'I Don\'t Accept'
  },
  jhcsAlert: {
    title: 'JHCS Alert',
    message: 'Per TB 700-2, NAVSEAINST 8020.8C, TO 11A-1-47 - Hazard Classifications in the JHCS are for AE in their transportation and storage configurations. \nContact a service hazard classifier for additional information regarding unpackaged AE hazard classifications.'
  },
  jhcsAdminInfoMessage: {
    title: 'Contact Admin',
    message: 'Please send your inquiries to our administrators at the following email: \nusarmy.pentagon.hqda-dod-esb.mesg.ddesbsupport@mail.mil'
  },
  classification: {
    default: 'UNCLASSIFIED/FOUO'
  },
  securityBanners: [
    {
      bannerName: 'UNCLASSIFIED/FOUO',
      backgroundColor: 'green',
      textColor: 'white',
      default: true
    },
    {
      bannerName: 'CONFIDENTIAL',
      backgroundColor: 'yellow',
      textColor: 'white',
      default: false
    },
    {
      bannerName: 'SECRET',
      backgroundColor: 'red',
      textColor: 'white',
      default: false
    }
  ],
  api: {
    clientErrorLoggerEndpoint: "/jhcs/clientErrorLogger",
    securityEndpoint: "/jhcs/security",
    options: {
      retries: 1,
      timeout: 3600000
    }
  },
  session: {
    pingIntervalInSeconds: 10,
    idleTimeInSeconds: 10 * 60,
    timeoutInSeconds: 5 * 60
  },
  ui: {
    snackBar: {
      duration: 5000
    }
  },
  defaultLogoutUrl: ""
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

