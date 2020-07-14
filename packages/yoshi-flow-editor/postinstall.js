try {
  const generateBITypes = require('./build/scripts/generate-bi-types').default;
  generateBITypes();
} catch (e) {
  console.warn(e);
}
