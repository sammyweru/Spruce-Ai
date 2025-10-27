
import { ShowroomItem, DesignChallenge } from '../types';

// In a real application, this data would come from a database.
// To fix the fetching errors, we are now using static base64 SVG placeholders
// instead of fetching from an external URL.

export const showroomData: ShowroomItem[] = [
    {
        id: 'showroom-1',
        originalImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxpdmluZyBSb29tPC90ZXh0Pjwvc3ZnPg==',
            mimeType: 'image/svg+xml',
            name: 'living-room-original.svg'
        },
        generatedImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0U0RDhCNCIvPjxyZWN0IHg9IjEwMCIgeT0iMjUwIiB3aWR0aD0iMjUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0EyNzAzNSIvPjxjaXJjbGUgY3g9IjU1MCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSIjNUU2RDU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+QWZyb01vZGVybjwvdGV4dD48L3N2Zz4=',
            mimeType: 'image/svg+xml',
            name: 'living-room-afromodern.svg'
        },
        style: 'Afro-Modern',
        author: 'Wanjiku',
        likes: 132,
        palette: ['#5E6D55', '#E4D8B4', '#A27035', '#F5F5F5', '#333333']
    },
    {
        id: 'showroom-2',
        originalImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlZHJvb208L3RleHQ+PC9zdmc+',
            mimeType: 'image/svg+xml',
            name: 'bedroom-original.svg'
        },
        generatedImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0ZGRiIvPjxyZWN0IHg9IjE1MCIgeT0iMzAwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRDNEM0QzIi8+PGxpbmUgeDE9IjE1MCIgeTE9IjQ1MCIgeDI9IjY1MCIgeTI9IjQ1MCIgc3Ryb2tlPSIjQTlBOUA5IiBzdHJva2Utd2lkdGg9IjEwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjNzA4MDkwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2NhbmRpbmF2aWFuPC90ZXh0Pjwvc3ZnPg==',
            mimeType: 'image/svg+xml',
            name: 'bedroom-scandinavian.svg'
        },
        style: 'Scandinavian',
        author: 'Juma',
        likes: 245,
        palette: ['#FFFFFF', '#D3D3D3', '#A9A9A9', '#708090', '#F0E68C']
    },
    {
        id: 'showroom-3',
        originalImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlBhdGlvPC90ZXh0Pjwvc3ZnPg==',
            mimeType: 'image/svg+xml',
            name: 'patio-original.svg'
        },
        generatedImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0VBRTBENSIvPjxwYXRoIGQ9Ik0gMTAwIDQwMCBDIDIwMCAyMDAsIDQwMCA1MDAsIDUwMCA0MDAiIHN0cm9rZT0iIzhCNDUxMyIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjY1MCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNDM0E5OTUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IiMyRjRGNEYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Cb2hlbWlhbjwvdGV4dD48L3N2Zz4=',
            mimeType: 'image/svg+xml',
            name: 'patio-bohemian.svg'
        },
        style: 'Bohemian',
        author: 'Akinyi',
        likes: 88,
        palette: ['#C3A995', '#EAE0D5', '#8B4513', '#2F4F4F', '#FFFAF0']
    }
];

export const challengesData: DesignChallenge[] = [
    {
        id: 'challenge-1',
        title: "This Week: The 'Ugly' Backyard",
        description: "This small, neglected backyard needs a major refresh! How would you turn it into a cozy urban oasis? Show us your best ideas!",
        promptImage: {
            base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzhGQUQ4RiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVnbHkgQmFja3lhcmQ8L3RleHQ+PC9zdmc+',
            mimeType: 'image/svg+xml',
            name: 'challenge-backyard.svg'
        },
        submissions: [
            {
                id: 'sub-1', author: 'Muthoni', votes: 42,
                generatedImage: { base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0JFRDhCOCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlplbiBHYXJkZW48L3RleHQ+PC9zdmc+', mimeType: 'image/svg+xml', name: 'sub1.svg' }
            },
            {
                id: 'sub-2', author: 'Kamau', votes: 78,
                generatedImage: { base64: 'PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI0FFQzZBRiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI0OCIgZmlsbD0iIzU1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZpcmUgUGl0IFZpYmVzPC90ZXh0Pjwvc3ZnPg==', mimeType: 'image/svg+xml', name: 'sub2.svg' }
            },
        ]
    }
];
