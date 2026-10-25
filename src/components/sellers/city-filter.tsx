'use client';

// React
import { useState } from 'react';

// Components
import CitySelect from '@/components/shared/city-select';

/** فیلد شهرِ فرم GET فهرست فروشندگان؛ مقدار در `input[name=city]` پنهان به query می‌رود */
export default function CityFilter({ defaultValue }: { defaultValue?: string }) {
    const [city, setCity] = useState(defaultValue ?? '');
    return (
        <CitySelect
            name="city"
            value={city}
            onChange={setCity}
            allowAll
            className="min-w-0 flex-1 sm:w-44 sm:flex-none"
        />
    );
}
