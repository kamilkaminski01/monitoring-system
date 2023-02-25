import Swal from 'sweetalert2';

export const swalCornerError = (title = 'Error', text = 'Error event') => {
  const config = {
    icon: 'error',
    position: 'top-right',
    toast: true,
    title,
    text
  };
  return Swal.fire(config);
};

export const swalCornerSuccess = (title = 'Success', text = 'Successfull event') => {
  const config = {
    icon: 'success',
    position: 'top-right',
    toast: true,
    title,
    text
  };
  return Swal.fire(config);
};

export const swalError = (title = 'Error', text = 'Error event') => {
  const config = {
    icon: 'error',
    title,
    text
  };
  return Swal.fire(config);
};

export const swalSuccess = (title = 'Success', text = 'Successfull event') => {
  const config = {
    icon: 'success',
    title,
    text
  };
  return Swal.fire(config);
};

export const swalWarning = (title = 'Warning', text = 'Warning event') => {
  const config = {
    icon: 'warning',
    title,
    text
  };
  return Swal.fire(config);
};
