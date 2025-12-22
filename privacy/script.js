// Syntax & Soz - Ghost Mode Demo Controller

function togglePrivacy(feature) {
    const mockApp = document.getElementById('mockApp');
    const isChecked = event.target.checked;
    
    // Class Mapping
    const classMap = {
        'content': 'blur-content',
        'groups': 'blur-groups',
        'contacts': 'blur-contacts',
        'names': 'hide-names',
        'photos': 'hide-photos'
    };

    const targetClass = classMap[feature];

    if (isChecked) {
        mockApp.classList.add(targetClass);
    } else {
        mockApp.classList.remove(targetClass);
    }
}