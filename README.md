# Solution to Rover Code Challenge

By [Zack Carlson](mailto:zackt.carlson@gmail.com)

## Instructions

1. Navigate to [repo](https://github.com/zackcarlson/rover-challenge)
2. Download zip or clone locally: `git clone https://github.com/zackcarlson/rover-challenge.git` 
3. Install dependencies with `npm install`
4. Run tests using `npm test`
5. Build the app: `npm run build`
6. Create symlink: `npm link`
7. Run the app using `rank-search`
8. Enjoy!

## Discussion

> Imagine you are designing a production web application to compute the search scores for sitters and to return a list of sitters for search results. How would you do it?

On a very high level, because Rover is highly trafficked, I'd 1) opt for a scalable SQL database; 2) build a load-balancer (possibly Dynamic Round Robin approach) to distribute incoming requests to the `/api/search-sitters` endpoint; 3) integrate server side caching, like Redis, to reduce the number of API requests; 4) implement pagination and lazyloading to reduce the amount of content to load on the page, which also reduces user wait time. Some basic frontend edge cases would include: handling validation errors and disabling multiple form submissions for (in)complete forms. 

I'd use React/Redux with TypeScript on the client for quick development, reliable/scalable state management, and accurate type checking. On the backend, I'd use Python with MySQL in order to handle larger datasets and perform fast computations. A consideration for improving the current Search score equation might be to replace the Profile score metric (5 * uniqueEnglishCharsInSittersName / 26) with the `response_time_minutes` attribute ([from reviews.csv](src/models/reviews.csv)) as it is a more accurate evaluation of the sitter's skill. 

I used the following technologies: TypeScript, JavaScript, Mocha, Chalk, Ora, Inquirer, Husky, and Eslint.

## Checklist:
- [x] Are Profile, Rating, and Search Scores computed correctly?
- [x] Does the output file include all necessary columns, and is it in descending order based on Search Score? 
- [x] Does the README include setup/running instructions (ideally for Mac)?
- [x] Does the README include your answer to the Discussion Question?
- [x] Have you pushed up your CLI code, README, and output file back into the repository? 