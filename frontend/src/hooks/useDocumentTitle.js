import { useEffect } from 'react'

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export default useDocumentTitle
