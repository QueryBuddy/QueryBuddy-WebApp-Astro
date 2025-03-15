import fetch from 'node-fetch';
import jsdom from 'jsdom';

export default async function({ title }) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(title)}&exintro=1`

  try {
    const response = await fetch(url)
    const data = await response.json()
    
    const pages = data.query.pages
    const pageId = Object.keys(pages)[0]
    
    if (pageId === '-1') {
      return 'Article not found'
    }

    const extract = pages[pageId].extract
    return extract.replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
  } catch (error) {
    return `Error fetching Wikipedia article: ${error.message}`
  }
}
