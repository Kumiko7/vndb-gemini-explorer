
import { Type, FunctionDeclaration } from '@google/genai';

// A canonical list of all valid fields for each query type, based on VNDB API docs.
export const VALID_FIELDS: Record<string, Set<string>> = {
  queryVn: new Set([
    'id', 'title', 'alttitle', 'titles.lang', 'titles.title', 'titles.latin', 'titles.official', 'titles.main', 'aliases', 'olang',
    'devstatus', 'released', 'languages', 'platforms', 'image.id', 'image.url', 'image.dims', 'image.sexual', 'image.violence', 'image.votecount', 'image.thumbnail', 'image.thumbnail_dims',
    'length', 'length_minutes', 'length_votes', 'description', 'average', 'rating', 'votecount',
    'screenshots.id', 'screenshots.url', 'screenshots.dims', 'screenshots.sexual', 'screenshots.violence', 'screenshots.votecount', 'screenshots.release.id',
    'relations.relation', 'relations.relation_official', 'relations.id', 'relations.title',
    'tags.rating', 'tags.spoiler', 'tags.lie', 'tags.id', 'tags.name',
    'developers.id', 'developers.name',
    'editions.eid', 'editions.lang', 'editions.name', 'editions.official',
    'staff.eid', 'staff.role', 'staff.note', 'staff.id', 'staff.name',
    'va.note', 'va.staff.id', 'va.staff.name', 'va.character.id', 'va.character.name',
    'extlinks.url', 'extlinks.label', 'extlinks.name', 'extlinks.id'
  ]),
  queryCharacter: new Set([
    'id', 'name', 'original', 'aliases', 'description', 'image.id', 'image.url',
    'blood_type', 'height', 'weight', 'bust', 'waist', 'hips', 'cup', 'age', 'birthday', 'sex', 'gender',
    'vns.spoiler', 'vns.role', 'vns.id', 'vns.title', 'vns.release.id',
    'traits.spoiler', 'traits.lie', 'traits.id', 'traits.name'
  ]),
  queryRelease: new Set([
    'id', 'title', 'alttitle', 'languages.lang', 'languages.title', 'languages.latin', 'languages.mtl', 'languages.main', 'platforms',
    'media.medium', 'media.qty', 'vns.rtype', 'vns.id', 'vns.title',
    'producers.developer', 'producers.publisher', 'producers.id', 'producers.name',
    'images.id', 'images.url', 'images.dims', 'images.sexual', 'images.violence', 'images.votecount', 'images.type', 'images.vn', 'images.languages', 'images.photo',
    'released', 'minage', 'patch', 'freeware', 'uncensored', 'official', 'has_ero', 'resolution', 'engine', 'voiced', 'notes', 'gtin', 'catalog',
    'extlinks.url', 'extlinks.label', 'extlinks.name', 'extlinks.id'
  ]),
  queryProducer: new Set([
    'id', 'name', 'original', 'aliases', 'lang', 'type', 'description',
    'extlinks.url', 'extlinks.label', 'extlinks.name', 'extlinks.id'
  ]),
  queryStaff: new Set([
    'id', 'aid', 'ismain', 'name', 'original', 'lang', 'gender', 'description',
    'extlinks.url', 'extlinks.label', 'extlinks.name', 'extlinks.id',
    'aliases.aid', 'aliases.name', 'aliases.latin', 'aliases.ismain'
  ]),
  queryTag: new Set([
    'id', 'name', 'aliases', 'description', 'category', 'searchable', 'applicable', 'vn_count'
  ]),
  queryTrait: new Set([
    'id', 'name', 'aliases', 'description', 'searchable', 'applicable', 'sexual', 'group_id', 'group_name', 'char_count'
  ]),
  queryQuote: new Set([
    'id', 'quote', 'score',
    'vn.id', 'vn.title',
    'character.id', 'character.name'
  ])
};

// A canonical list of all valid filters for each query type.
export const VALID_FILTERS: Record<string, Set<string>> = {
  queryVn: new Set([
    'id', 'search', 'lang', 'olang', 'platform', 'length', 'released', 'rating', 'votecount',
    'has_description', 'has_anime', 'has_screenshot', 'has_review', 'devstatus',
    'tag', 'dtag', 'anime_id', 'label', 'release', 'character', 'staff', 'developer'
  ]),
  queryCharacter: new Set([
    'id', 'search', 'role', 'blood_type', 'sex', 'sex_spoil', 'gender', 'gender_spoil',
    'height', 'weight', 'bust', 'waist', 'hips', 'cup', 'age', 'trait', 'dtrait',
    'birthday', 'seiyuu', 'vn'
  ]),
  queryRelease: new Set([
    'id', 'search', 'lang', 'platform', 'released', 'resolution', 'resolution_aspect',
    'minage', 'medium', 'voiced', 'engine', 'rtype', 'extlink', 'patch', 'freeware',
    'uncensored', 'official', 'has_ero', 'vn', 'producer'
  ]),
  queryProducer: new Set([
    'id', 'search', 'lang', 'type', 'extlink'
  ]),
  queryStaff: new Set([
    'id', 'aid', 'search', 'lang', 'gender', 'role', 'extlink', 'ismain'
  ]),
  queryTag: new Set([
    'id', 'search', 'category'
  ]),
  queryTrait: new Set([
    'id', 'search'
  ]),
  queryQuote: new Set([
    'random', 'vn', 'character'
  ])
};

// Common properties for filters and query options
const commonQueryProps = {
    filters: {
        type: Type.STRING,
        description: `A JSON string representing the filter array. E.g., '[\\"search\\", \\"=\\", \\"Steins;Gate\\"]' or '[\\"and\\", [\\"id\\", \\"=\\", \\"v17\\"], [\\"lang\\", \\"=\\", \\"en\\"]]'. Use this to build complex queries.`
    },
    sort: { type: Type.STRING, description: `Field to sort on. E.g., 'rating', 'released', 'votecount'.`, nullable: true },
    reverse: { type: Type.BOOLEAN, description: `Set to true to sort in descending order.`, nullable: true },
    results: { type: Type.INTEGER, description: `Number of results per page, max 100. Default is 100.`, nullable: true },
    count: { type: Type.BOOLEAN, description: 'Set to true to get the total number of entries matching the filters. When using count, you should set results to 0 to avoid fetching the actual entries.', nullable: true },
};

export const queryVnFunctionDeclaration: FunctionDeclaration = {
    name: 'queryVn',
    description: 'Queries the VNDB database for visual novel (VN) entries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            random: {
                type: Type.BOOLEAN,
                description: "Set to true to fetch a single random visual novel that matches the other filters. When true, 'sort', 'reverse', and 'results' arguments are ignored, as it will always return one random entry.",
                nullable: true
            },
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'title', 'released', 'rating', 'votecount', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryVn).join(', ')}.
- CRITICAL: You CANNOT filter visual novels using a 'name' filter. To find a VN by its title, use the 'search' filter. Example: '["search", "=", "Steins;Gate"]'.
- CRITICAL: To filter by developer, you MUST use the singular 'developer' filter with a nested producer filter. Example: '["developer", "=", ["id", "=", "p98"]]'. The filter name is 'developer', NOT 'developers'.
- CRITICAL 'tag' filter: To filter by a tag, you MUST use the tag's ID directly. Do NOT nest an 'id' filter. Correct: '["tag", "=", "g192"]'. Incorrect: '["tag", "=", ["id", "=", "g192"]]'.
- SPOILER TAGS: To include tags with spoiler levels, you MUST provide a three-element array: [tag_id, max_spoiler_level, min_tag_rating]. \`max_spoiler_level\` can be 0 (none), 1 (minor), or 2 (major). \`min_tag_rating\` is a number from 0 to 3. To search for a tag at *any* spoiler level, use 2 for \`max_spoiler_level\`. For example, '["tag", "=", ["g192", 2, 0]]' finds all VNs with tag 'g192' up to major spoilers. A simple '["tag", "=", "g192"]' is equivalent to '["tag", "=", ["g192", 0, 0]]' and will miss most spoilers.
- CRITICAL: The 'role' filter is NOT valid for visual novels directly; it is used for characters and staff. To filter by staff role on a VN, it must be nested.
- To filter by a staff member, you MUST provide a nested staff filter. Example: '["staff", "=", ["search", "=", "Urobuchi Gen"]]'.
- To filter by a staff member's role, use a nested staff filter with a 'role' filter. The valid values for 'role' are: "staff", "art", "director", "chardesign", "qa", "songs", "music", "scenario", "editor", "translator". Example: '["staff", "=", ["role", "=", "director"]]'.
- COMPLEX FILTER EXAMPLE: You can combine filters with 'and'/'or' and use operators like '>=', '<=', '!=', etc. Here is a full example that finds VNs in English, German, or French, where the original language is not Japanese, and which have a release on or after Jan 1, 2020 by producer 'p30'. The JSON string would look like this: '[\\"and\\", [\\"or\\", [\\"lang\\", \\"=\\", \\"en\\"], [\\"lang\\", \\"=\\", \\"de\\"], [\\"lang\\", \\"=\\", \\"fr\\"]], [\\"olang\\", \\"!=\\", \\"ja\\"], [\\"release\\", \\"=\\", [\\"and\\", [\\"released\\", \\">=\\", \\"2020-01-01\\"], [\\"producer\\", \\"=\\", [\\"id\\", \\"=\\", \\"p30\\"]]]]]'.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. CRITICAL: For object fields like 'image', 'va', or 'staff', you MUST specify sub-fields (e.g., 'image.url', 'va.staff.name', 'staff.name'). Requesting the parent object alone is invalid. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryVn).join(', ')}.`
            },
        },
        required: ['fields']
    },
};
export const queryCharacterFunctionDeclaration: FunctionDeclaration = {
    name: 'queryCharacter',
    description: 'Queries the VNDB database for character entries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'name', 'searchrank'.`,
                nullable: true
            },
            filters: { // Overriding the common filters property
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryCharacter).join(', ')}.
- CRITICAL 'name' vs 'search' filter: You CANNOT filter characters using a 'name' filter. To find a character by their name, you MUST use the 'search' filter. Example: '["search", "=", "Luna"]'.
- CRITICAL: You CANNOT filter characters by a visual novel's title directly. Do NOT use a 'title' filter here. To find characters from a specific VN, you must FIRST use the 'queryVn' tool to find the VN's ID, and THEN use that ID with the 'vn' filter. Example: '["vn", "=", ["id", "=", "v17"]]'.
- CRITICAL 'gender' filter: The 'gender' filter only accepts single-letter values: "m" (male), "f" (female), "o" (non-binary), "a" (ambiguous). Do NOT use full words like "female".
- CRITICAL 'trait' vs 'dtrait' filters: Both filters are singular ('trait', 'dtrait'), not plural. You CANNOT filter traits by name directly. To find characters with a specific trait, you MUST perform a multi-step query: 1. First, use the 'queryTrait' tool to find the trait's ID. 2. Second, use the 'trait' or 'dtrait' filter with the retrieved ID.
  - Use 'trait' to match a trait and its children (e.g., filtering by the "sibling" trait ID will also match characters with "younger sister" or "older brother"). 
  - Use 'dtrait' for a precise search that only matches the specified trait directly (e.g., filtering by the "sister" trait ID will not return characters with the "younger sister" trait). For most cases you should use 'trait', not 'dtrait'.
- COMBINING FILTERS: To combine multiple filters, use an "and" operator. For example, to find characters named "月望" who are tagged with the trait "i123", use: '["and", ["search", "=", "月望"], ["trait", "=", "i123"]]'.
- SPOILER TRAITS: To include traits with spoiler levels, you MUST provide a two-element array: [trait_id, max_spoiler_level]. \`max_spoiler_level\` can be 0 (none), 1 (minor), or 2 (major). To search for a trait at *any* spoiler level, use 2 for \`max_spoiler_level\`. For example, to find characters with trait 'i123' at any spoiler level, use '["trait", "=", ["i123", 2]]'. A simple '["trait", "=", "i123"]' is equivalent to '["trait", "=", ["i123", 0]]' and will miss spoilers.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields. CRITICAL: For object fields like 'image', you MUST specify sub-fields (e.g., 'image.url'). Requesting 'image' alone is invalid. Note: Voice actor (va) info is NOT available here; query the VN endpoint for that. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryCharacter).join(', ')}.`
            },
        },
        required: ['filters', 'fields']
    },
};
export const queryReleaseFunctionDeclaration: FunctionDeclaration = {
    name: 'queryRelease',
    description: 'Queries the VNDB database for release entries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'title', 'released', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryRelease).join(', ')}.
- CRITICAL: To filter by producer, you MUST use the singular 'producer' filter with a nested producer filter. Example: '["producer", "=", ["id", "=", "p98"]]'. The filter name is 'producer', NOT 'producers'.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. Use dot notation for nested fields like 'vns.title'. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryRelease).join(', ')}.`
            },
        },
        required: ['filters', 'fields']
    },
};

export const queryProducerFunctionDeclaration: FunctionDeclaration = {
    name: 'queryProducer',
    description: 'Queries the VNDB database for producer (developer/publisher) entries.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'name', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryProducer).join(', ')}.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryProducer).join(', ')}.`
            }
        },
        required: ['filters', 'fields']
    },
};

export const queryStaffFunctionDeclaration: FunctionDeclaration = {
    name: 'queryStaff',
    description: "Queries the VNDB database for staff entries (e.g., artists, writers, voice actors). CRITICAL: This API queries staff names, not unique people. A staff entry with multiple names can be returned multiple times in the results. For fetching detailed info on a specific person, this is not ideal. Use the 'ismain' filter to get a unique entry per person.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'name', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryStaff).join(', ')}.
- CRITICAL 'ismain' filter: To get unique results (one per person), you MUST use the 'ismain' filter, which removes duplication from staff with multiple aliases. It accepts the integer 1. For example, to get only the main entry for staff 's81', use the filter '["and", ["ismain", "=", 1], ["id", "=", "s81"]]'.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryStaff).join(', ')}.`
            }
        },
        required: ['filters', 'fields']
    },
};

export const queryTagFunctionDeclaration: FunctionDeclaration = {
    name: 'queryTag',
    description: 'Queries for content, technical, or sexual content tags applied to visual novels.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'name', 'vn_count', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryTag).join(', ')}.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryTag).join(', ')}.`
            }
        },
        required: ['filters', 'fields']
    },
};

export const queryTraitFunctionDeclaration: FunctionDeclaration = {
    name: 'queryTrait',
    description: 'Queries for traits applied to characters.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'name', 'char_count', 'searchrank'.`,
                nullable: true
            },
            filters: {
                type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryTrait).join(', ')}. Use the 'search' filter to find traits by name.
- CRITICAL: When searching for traits like "pink hair" or "blue eyes", you MUST search only for the core descriptor. For "pink hair", search for "pink". For "blue eyes", search for "blue".
- Examples of traits to search for include "pink", "blond", "student", or "younger sister".
- Example filter: '["search", "=", "student"]'.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryTrait).join(', ')}.`
            }
        },
        required: ['filters', 'fields']
    },
};

export const queryQuoteFunctionDeclaration: FunctionDeclaration = {
    name: 'queryQuote',
    description: 'Queries for quotes from visual novels.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            ...commonQueryProps,
            sort: {
                type: Type.STRING,
                description: `Field to sort on. Valid values: 'id', 'score'.`,
                nullable: true
            },
            filters: {
                 type: Type.STRING,
                description: `A JSON string representing the filter array. You MUST ONLY use filters from the following list: ${Array.from(VALID_FILTERS.queryQuote).join(', ')}. To get a random quote, use filter: '["random", "=", 1]'. You can also filter by VN or character ID.`
            },
            fields: {
                type: Type.STRING,
                description: `A comma-separated string of fields to retrieve. Use dot notation for nested fields like 'vn.title' and 'character.name'. You MUST ONLY use fields from the following list: ${Array.from(VALID_FIELDS.queryQuote).join(', ')}.`
            }
        },
        required: ['fields']
    },
};

export function getSystemInstruction(currentDate: string, hasImage: boolean): string {
    let systemInstruction = `You are an expert assistant for the Visual Novel Database (VNDB).
- Your primary goal is to use the provided tools to find relevant information and present it clearly.
- You can process user-uploaded images to identify characters, visual novels, or themes, and then use your tools to find information about them.
- You can query for visual novels (vn), characters, releases, producers, staff, tags, traits, and quotes.
- COUNTING: When asked for the number of items (e.g., "how many VNs are there?"), you MUST use the \`count\` parameter set to \`true\`. For efficiency, you SHOULD also set \`results\` to \`0\` to only get the count and not the data.
- RANDOM VNs: To fetch a random visual novel, set the 'random' parameter to 'true' in your 'queryVn' tool call. This will return one random VN that matches any other filters you provide.
- CRITICAL: You MUST ONLY request fields that are explicitly listed as valid for the specific tool you are calling.
- CRITICAL: You MUST ONLY use filters that are explicitly listed as valid for the specific tool you are calling.
- IMPORTANT: If you request an invalid field for a tool, it will be automatically removed from the API request. You will receive a note in the tool's response informing you which fields were removed. Pay attention to these notes to learn and avoid making the same mistake.
- CRITICAL: For object fields like 'image', 'va', or 'staff', you MUST specify sub-fields (e.g., 'image.url', 'va.staff.name', 'staff.name'). Requesting the parent object alone (e.g., 'image') is invalid and will fail.
- CRITICAL FIELD & FILTER NAMES: A visual novel has a 'title', but to filter it by title, you MUST use the 'search' filter (e.g., '["search", "=", "Steins;Gate"]'). A character has a 'name'. Using a 'name' filter on a VN will cause an error. Voice actor info ('va') is on VNs, not characters. The 'role' filter is only for characters and staff, NOT for visual novels.
- CRITICAL MULTI-STEP QUERIES: For requests that require information across different types (like finding characters by a VN's title), you MUST perform multiple tool calls. For example, to find characters in "Steins;Gate": 1. First, use 'queryVn' with a 'search' filter to get the VN's ID. 2. Second, use 'queryCharacter' with the 'vn' filter and the retrieved ID (e.g., '["vn", "=", ["id", "=", "v17"]]'). Directly filtering characters by a VN's 'title' is invalid and will fail.
- If an initial search is too broad, you MUST refine your query with a more specific filter and call the tool again.
- Once you have the final information, summarize it for the user. Do not just list raw data.
- If the API returns no results, inform the user you couldn't find anything.
Today's date is ${currentDate}.`;

    if (hasImage) {
        systemInstruction += `
- IMAGE ANALYSIS STRATEGY: When an image is provided, it may be a screenshot from a visual novel. To identify the source VN, a good strategy is to first identify any visible characters. Then, search for those characters using their names and prominent visual traits (e.g., "pink") via the 'queryCharacter' tool. The resulting character information will often include the visual novels they appear in, which will help you identify the source material.`;
    }
    return systemInstruction;
}
