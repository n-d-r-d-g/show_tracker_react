import { readdir } from 'fs/promises';

console.log('Starting generating i18n resources script');

const path = 'public/locales/en';

readdir(path)
  .then((filenames) => {
    return filenames.reduce(
      (accumulator, filename) => {
        const key = filename.slice(0, -5);

        return {
          ...accumulator,
          [key]: `../../public/locales/en/${filename}`,
        };
      },

      {}
    );
  })
  .catch((error) => console.error(error));
