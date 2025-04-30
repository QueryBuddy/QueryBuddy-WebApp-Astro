import jsdom from 'jsdom';

async function getContent({ url, scope2 }: { url: string, scope2: string }) {
  if (!url) {
    return 'ERROR: Unable to get contents of the requested page. Please check the URL and try again.'
  }

  if (url.includes('*')) url = url.replace('*', '')

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    let body = await response.text();

    if (body) {
      if (scope2 !== 'none') {
        var dom = new jsdom.JSDOM(body);
        const element = dom.window.document.querySelector(scope2);
        if (!element) {
          return 'ERROR: Unable to get contents of the requested page. Please check the URL and try again.';
        }
        
        var selectors = [
          'style',
          'script', 
          'script',
          'svg',
          'link',
        ]

        selectors.forEach(function(m, i) {
          var mS = element.querySelectorAll(m)
          if (mS) {
            mS.forEach(function(em, i) {
              em.remove()
            })
          }
        })
      
        body = element.innerHTML;
        if (body.includes('<')) body = body.split('<').join('&lt;')
        if (body.includes('>')) body = body.split('>').join('&gt;')
      }
      else {
        body = 'ERROR'
      }

      return body
    }
  } catch (error) {
    return 'ERROR: Unable to get contents of the requested page. Please check the URL and try again.'
  }
}

export default async function({ links }: { links: string[] }) {
    try {
        const results = await Promise.all(links.map(async (url: string) => {
            const response = await fetch(url)
            const text = await response.text()
            return text
        }))
        return results.join('\n\n')
    } catch (error) {
        return `Error fetching content: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
}