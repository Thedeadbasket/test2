export function FirstVisitChecker() {
    const visited = sessionStorage.getItem('visited_in_session');
    const isFirstInSession = visited !== 'true';

    if (isFirstInSession) {
        sessionStorage.setItem('visited_in_session', 'true');
        console.log('Erster Besuch in dieser Session');
    }
    else {
        console.log('!Erster Besuch in dieser Session');
    }

    return isFirstInSession;
}
