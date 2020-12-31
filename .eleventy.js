const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require("fs");

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const widont = require("widont");
const md = require("markdown-it")({
  html: true,
  linkify: true,
  typographer: true,
});

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

module.exports = function(config) {
  // Filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('markdownFilter', markdownFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Transforms
  config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');
  config.addPassthroughCopy('src/admin/config.yml');
  config.addPassthroughCopy('src/admin/previews.js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');

  const now = new Date();

  // Custom collections
  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts)
    ].reverse();
  });

  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md').filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('patterns', collection => {
    return [
      ...collection.getFilteredByGlob('./src/patterns/*.md')
    ];
  });
  config.addFilter('dayFilter', require('./src/filters/day-filter.js'));
  config.addFilter('openBatchFilter', require('./src/filters/open-batch-filter.js'));
  config.addFilter('extractKeyFilter', require('./src/filters/extract-key-filter.js'));
  
  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  // Markdownify
  config.addFilter("markdownify", text => {
    return md.renderInline( text );
  });

  // Get the first `n` elements of a collection.
  config.addFilter("limit", (array, n) => {
    if ( n < 0 )
    {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  // Get an item by its id
  config.addFilter("findByProperty", (array, property, value) => {
    console.log(array, property, value);
    var i = array.length;
    while ( i-- )
    {
      if ( property in array[i] &&
           array[i][property] == value )
      {
        console.log( array[i] );
        return array[i];
      }
    }

    return [];
  });

  // Widont
  config.addFilter("widont", function(text) {
    return `${widont( text )}`;
  });

  // JSON
  config.addFilter("json", function(obj) {
    return JSON.stringify( obj, null, '' );
  });

  // 404 
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    passthroughFileCopy: true
  };
};
