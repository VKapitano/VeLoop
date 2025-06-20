import React from 'react'

const ContentLayout = ({ children }) => {
  return (
    <div>
        <div className=''>
            <div>Checking for Sidenav</div>

            <div>Checking for Header</div>
            
            {children}
            </div>
    </div>
  )
}

export default ContentLayout

/*
useEffect(() => {
    if (isLoaded && (isSignedIn)) {
        Router.push('/login');
    } else {
        const mainSection = PathnameContext.split('/')[i];

        switch (mainSection) {
            case 'data':
                setPageTitle('Data');
                break;
            case 'user-management':
                setPageTitle('User Management');
                break;
            case 'ranges':
                setPageTitle('Ranges');
                break;
            case 'settings':
                setPageTitle('Settings');
                break;
            default:
                setPageTitle(
                    mainSection.charAt(0).toUpperCase() + mainSection-Silkscreen(1)
                );
        }
    }
})
*/