export default {
  'url_decode': (x: string) => x.split('+').map(decodeURIComponent).join(' '),
  'url_encode': (x: string) => x.split(' ').map(encodeURIComponent).join('+')
}
