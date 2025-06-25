import React from 'react'

import Users from '../../components/Users'


const page = () => {
    return (
        <div className="h-full dark:bg-gray-850 p-1 flex flex-col gap-6">
            <Users />
        </div>
    )
}

export default page