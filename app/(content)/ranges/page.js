import React from 'react'

import Ranges_bar from '../../components/Ranges_bar'
import Ranges_list from '../../components/Ranges_list'


const page = () => {
    return (
        <div className="h-full dark:bg-gray-850 p-2 flex flex-col gap-6">
            <Ranges_bar />
            <Ranges_list />
        </div>
    )
}

export default page