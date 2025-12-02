
import type { VnData, CharacterData, ReleaseData, ProducerData, StaffData, TagData, TraitData, QuoteData } from '../types';

const API_ENDPOINT = 'https://api.vndb.org/kana';

interface QueryArgs {
    filters?: string;
    fields?: string;
    sort?: string;
    reverse?: boolean;
    results?: number;
    count?: boolean;
    random?: boolean;
}

async function postQuery<T>(endpoint: string, args: QueryArgs): Promise<{ results: T[], count?: number }> {
    try {
        const body = {
            ...args,
            filters: JSON.parse(args.filters || '[]'),
            results: args.results !== undefined ? args.results : 100,
        };

        const response = await fetch(`${API_ENDPOINT}/${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`VNDB API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return { results: data.results || [], count: data.count };
    } catch (error) {
        console.error(`Error querying VNDB ${endpoint}:`, error);
        // Return a structured error message that Gemini can understand
        return { results: [{ error: `Failed to query VNDB ${endpoint}: ${error instanceof Error ? error.message : String(error)}` }] as any[] };
    }
}

export async function queryVn(args: QueryArgs) {
    if (args.random) {
        // 1. Get the highest ID based on current filters to set the upper bound for randomness.
        const maxIdArgs = {
            filters: args.filters,
            fields: 'id',
            sort: 'id',
            reverse: true,
            results: 1,
        };
        const maxIdResponse = await postQuery<{ id: string }>('vn', maxIdArgs);

        const maxIdResult = maxIdResponse.results[0];
        if (!maxIdResult || (maxIdResult as any).error) {
            return { 
                results: [{ error: `Could not find any VN matching the filters to select a random one from. Details: ${ (maxIdResult as any)?.error || 'No results found.'}` }],
                count: 0
            };
        }

        const maxIdNum = parseInt(maxIdResult.id.substring(1), 10);
        if (isNaN(maxIdNum) || maxIdNum <= 0) {
            return { results: [{ error: `Failed to parse a valid maximum ID. Got: ${maxIdResult.id}` }], count: 0 };
        }

        // 2. Generate a random ID number and construct the filter for the second query.
        const randomIdNum = Math.floor(Math.random() * maxIdNum) + 1;
        const randomFilter = ['id', '>=', `v${randomIdNum}`];

        // 3. Combine with any existing filters provided by the model.
        const existingFilters = args.filters ? JSON.parse(args.filters) : [];
        const combinedFilters = existingFilters.length > 0
            ? ['and', existingFilters, randomFilter]
            : randomFilter;

        // 4. Fetch the actual VN using the combined filters.
        const finalFields = new Set((args.fields || '').split(',').map(f => f.trim()).filter(Boolean));
        finalFields.add('id');
        finalFields.add('title');
        finalFields.add('image.url');

        const finalArgs = {
            filters: JSON.stringify(combinedFilters),
            fields: Array.from(finalFields).join(','),
            sort: 'id', // Get the nearest increasing ID
            reverse: false,
            results: 1, // We only want one random result
        };

        const response = await postQuery<Omit<VnData, 'type'>>('vn', finalArgs);
        return {
            results: response.results.map(item => ({ ...item, type: 'vn' as const })),
            count: response.count,
        };
    }

    // Original logic for non-random queries
    const updatedArgs = { ...args };
    // Ensure essential fields are always included in the request for UI display.
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('title');
    fields.add('image.url'); // Always request the image URL
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<VnData, 'type'>>('vn', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'vn' as const })),
        count: response.count,
    };
}

export async function queryCharacter(args: QueryArgs) {
    const updatedArgs = { ...args };
     // Ensure essential fields are always included in the request for UI display.
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('name');
    fields.add('image.url'); // Always request the image URL
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<CharacterData, 'type'>>('character', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'character' as const })),
        count: response.count,
    };
}

export async function queryRelease(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('title');
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<ReleaseData, 'type'>>('release', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'release' as const })),
        count: response.count,
    };
}

export async function queryProducer(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('name');
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<any>('producer', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, producerType: item.type, type: 'producer' as const })),
        count: response.count,
    };
}

export async function queryStaff(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('name');
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<StaffData, 'type'>>('staff', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'staff' as const })),
        count: response.count,
    };
}

export async function queryTag(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('name');
    updatedArgs.fields = Array.from(fields).join(',');
    
    const response = await postQuery<Omit<TagData, 'type'>>('tag', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'tag' as const })),
        count: response.count,
    };
}

export async function queryTrait(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('name');
    fields.add('description');
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<TraitData, 'type'>>('trait', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'trait' as const })),
        count: response.count,
    };
}

export async function queryQuote(args: QueryArgs) {
    const updatedArgs = { ...args };
    const fields = new Set((updatedArgs.fields || '').split(',').map(f => f.trim()).filter(f => f));
    fields.add('id');
    fields.add('quote');
    updatedArgs.fields = Array.from(fields).join(',');

    const response = await postQuery<Omit<QuoteData, 'type'>>('quote', updatedArgs);
    return {
        results: response.results.map(item => ({ ...item, type: 'quote' as const })),
        count: response.count,
    };
}
