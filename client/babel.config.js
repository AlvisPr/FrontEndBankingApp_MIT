module.exports = {
    plugins: [
      // Only remove console.* calls in production
      process.env.NODE_ENV === 'production' && 'transform-remove-console'
    ].filter(Boolean), // This ensures the plugin is only added in production
  };
  
  