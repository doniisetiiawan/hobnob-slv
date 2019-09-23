function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'e@ma.il',
        password: 'password',
      };
    case 'replace user profile':
      return {
        summary: 'foo',
      };
    case 'update user profile':
      return {
        name: {
          middle: 'd4nyll',
        },
      };
    default:
  }
}

function convertStringToArray(string) {
  return string
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

function substitutePath(context, path) {
  return path
    .split('/')
    .map((part) => {
      if (part.startsWith(':')) {
        const contextPath = part.substr(1);
        return context[contextPath];
      }
      return part;
    })
    .join('/');
}

function processPath(context, path) {
  if (!path.includes(':')) {
    return path;
  }
  return substitutePath(context, path);
}

export { getValidPayload, convertStringToArray, processPath };
