const dummy = require('./dummy');
const Movie = require('../src/models/movie');

const { movies } = dummy;

const populate = (done) => {
  Movie.remove({})
    .then(() => {
      movies.forEach((movie) => {
        const entry = new Movie(movie);
        entry.save()
          .then(() => entry)
          .catch(e => e);
      });

      done();
    })
    .catch(e => done(e));
};

const count = () => movies.length;

module.exports = {
  populate,
  count
};
