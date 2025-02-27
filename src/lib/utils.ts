export function backButton(event: MouseEvent) {
    if (history.length > 1) {
        history.back();
        event.preventDefault();
    }
}