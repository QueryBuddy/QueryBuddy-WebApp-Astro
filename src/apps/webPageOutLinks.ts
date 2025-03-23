import fetch from 'node-fetch';
import jsdom from 'jsdom';

export default async function(url) {

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const body = await response.text();
    
    var dom = new jsdom.JSDOM(body);
    var links = dom.window.document.querySelectorAll('a');
    var outLinks = [];
    
    links.forEach(function(link) {
      if (link.href) outLinks.push(link.href);
    });
    
    return outLinks;
  } catch (error) {
    console.error('Error fetching page links:', error);
    return 'ERROR: Failed to fetch page links'
  }
}