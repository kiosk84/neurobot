// Basic worker implementation
self.addEventListener('message', (event) => {
  const { data } = event;
  
  // Process data based on type
  if (data.type === 'process') {
    // Example processing
    const result = processData(data.payload);
    self.postMessage({ type: 'result', payload: result });
  }
});

function processData(data) {
  // Example processing function
  return {
    processed: true,
    data: data,
    timestamp: new Date().toISOString()
  };
}