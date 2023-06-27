module.exports = {
  /**
   * Name of the integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @required
   */
  name: 'TruSTAR',
  /**
   * The acronym that appears in the notification window when information from this integration
   * is displayed.  Note that the acronym is included as part of each "tag" in the summary information
   * for the integration.  As a result, it is best to keep it to 4 or less characters.  The casing used
   * here will be carried forward into the notification window.
   *
   * @type String
   * @required
   */
  acronym: 'TRUS',
  /**
   * Description for this integration which is displayed in the Polarity integrations user interface
   *
   * @type String
   * @optional
   */
  description:
    'TruSTAR is an intelligence management platform that helps enterprises easily enrich and operationalize their security data.',
  entityTypes: ['IPv4', 'hash', 'email', 'url', 'domain'],
  defaultColor: 'light-pink',
  /**
   * An array of style files (css or less) that will be included for your integration. Any styles specified in
   * the below files can be used in your custom template.
   *
   * @type Array
   * @optional
   */
  styles: ['./styles/ts.less'],
  /**
   * Provide custom component logic and template for rendering the integration details block.  If you do not
   * provide a custom template and/or component then the integration will display data as a table of key value
   * pairs.
   *
   * @type Object
   * @optional
   */
  block: {
    component: {
      file: './components/ts-block.js'
    },
    template: {
      file: './templates/ts-block.hbs'
    }
  },
  summary: {
    component: {
      file: './components/ts-summary.js'
    },
    template: {
      file: './templates/ts-summary.hbs'
    }
  },
  request: {
    // Provide the path to your certFile. Leave an empty string to ignore this option.
    // Relative paths are relative to the Trustar integration's root directory
    cert: '',
    // Provide the path to your private key. Leave an empty string to ignore this option.
    // Relative paths are relative to the Trustar integration's root directory
    key: '',
    // Provide the key passphrase if required.  Leave an empty string to ignore this option.
    // Relative paths are relative to the Trustar integration's root directory
    passphrase: '',
    // Provide the Certificate Authority. Leave an empty string to ignore this option.
    // Relative paths are relative to the Trustar integration's root directory
    ca: '',
    // An HTTP proxy to be used. Supports proxy Auth with Basic Auth, identical to support for
    // the url parameter (by embedding the auth info in the uri)
    proxy: ""
  },
  logging: {
    level: 'info' //trace, debug, info, warn, error, fatal
  },
  /**
   * Options that are displayed to the user/admin in the Polarity integration user-interface.  Should be structured
   * as an array of option objects.
   *
   * @type Array
   * @optional
   */
  options: [
    {
      key: 'url',
      name: 'Base TruSTAR API URL',
      description: 'The base URL for the TruSTAR API including the schema (i.e., https://)',
      type: 'text',
      default: 'https://api.trustar.co',
      userCanEdit: false,
      adminOnly: true
    },
    {
      key: 'apiKey',
      name: 'Valid API Key',
      description: 'Valid TruSTAR API Key',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    },
    {
      key: 'apiSecret',
      name: 'Valid API Secret',
      description: 'Valid TruSTAR API Secret',
      default: '',
      type: 'password',
      userCanEdit: true,
      adminOnly: false
    }
  ]
};
