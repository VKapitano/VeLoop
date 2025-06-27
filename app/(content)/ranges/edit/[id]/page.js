'use client';

import RangeForm from '@/app/components/RangeForm';
import { useParams } from 'next/navigation';

const EditRangePage = () => {
    const params = useParams(); // Dohvati dinamički `id` iz URL-a
    const { id } = params;

    return <RangeForm mode="edit" rangeId={id} />;
};

export default EditRangePage;