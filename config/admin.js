module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'c44706cb0f397603361c0e981aa4bd3c'),
  },
});
