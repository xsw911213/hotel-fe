const isDugger = process.env.NODE_ENV !== 'production';

// console.log(window.location.hostname)
var development = {
  baseUrl: 'http://' + window.location.hostname + ':3010/api',
};
var production = {
  baseUrl: '/api',
};


export default isDugger ? development : production;
