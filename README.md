## Hacked News

[hn.binhrobles.com](https://hn.binhrobles.com)

Just another Hacker News remix, for learning. Wanted to see historically popular posts.

Consists of 3 pieces:

- [Remix](/app) acting as the client + client APIs
- [A Lambda](/packages/functions/liveDataFetch.ts) for periodically fetching the HN front page
- [A Lambda](/packages/functions/historicalDataFetch.ts) for loading in bulk historical data

Tech used:

- [Remix](https://remix.run)
- [Tailwind w/ DaisyUI](https://daisyui.com)
- [SST](https://sst.dev) for local dev + deployment
- [Hacker News API](https://github.com/HackerNews/API) for live data
- [hckrnews.com](https://hckrnews.com) endpoints for pulling historical data
