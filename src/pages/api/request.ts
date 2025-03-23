import type { APIRoute } from "astro";
import request from '../../lib/request'

export const GET: APIRoute = async ({ params }) => {
    var model = params.model
    var thread = params.thread
    var prompt = params.p
    var type = params.t
    var urls = params.urls
    var voice = params.v
    var startingMessage = params.startingmessage
    newRequest(
      model || '', thread || '', 
      prompt, type, urls=urls, voice=voice, 
      startingMessage=startingMessage
    )
  })

  return app

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}