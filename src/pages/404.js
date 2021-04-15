const PageNotFound = () => {
    if (typeof window !== undefined) {
        window.location = '/';
    }
    return null;
}

export default PageNotFound