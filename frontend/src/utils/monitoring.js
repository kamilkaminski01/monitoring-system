export const openMonitoringWindow = (event, path, location) => {
  event.preventDefault();
  window.open(`${path}/${location}`, '_blank', 'height=900,width=1435');
};
