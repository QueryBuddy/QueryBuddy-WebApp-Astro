import 'dotenv/config';

export default async function({ query, searchType }: { query: string, searchType: string }) {
  var params: string[] = []
  var urlPathname = 'url'
  var prop = 'href'
  var qKey = 'q'

  switch (searchType) {
    case 'image': 
      params.push('udm=2')
      urlPathname = 'imgres'
      prop = 'src'
      qKey = 'imgurl'
  }

  const urlParams = params.length > 0 ? `&${params.join('&')}` : ''
  var url = `https://www.googleapis.com/customsearch/v1?key=${process.env.SEARCH_API_KEY}&cx=750a504f8a13f45f4&q=${encodeURIComponent(query)}${urlParams}`

  try {
    const response = await fetch(url);
    var body = await response.text();
    
    if (!body) {
      return 'Empty Response Recieved'
    }

    const parsedBody = JSON.parse(body)

    var items = parsedBody.items

    return items
  } catch (error) {
    return 'ERROR: Failed to fetch search results'
  }
}