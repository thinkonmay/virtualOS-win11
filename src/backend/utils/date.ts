export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
    });
};
