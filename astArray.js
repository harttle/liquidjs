 const astArray = [
    {
        type: 'Identifier',
        name: 'subscriber$name',
        constant: false,
        toWatch: []
    },
    {
        type: 'Identifier',
        name: 'sd_date_of_issue',
        constant: false,
        toWatch: []
    },
    {
        type: 'Identifier',
        name: 'subscriber$address$inline',
        constant: false,
        toWatch: []
    },
    {
        type: 'Identifier',
        name: 'subscriber$name',
        constant: false,
        toWatch: []
    },
    {
        type: 'Identifier',
        name: 'contractor_entity$name',
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'ORIGINAL_contractor_entity$reference_id',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'IND01',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'ORIGINAL_contractor_entity$reference_id',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'IND02',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'ORIGINAL_contractor_entity$reference_id',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'IND04',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'ORIGINAL_contractor_entity$reference_id',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'IND05',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'ORIGINAL_contractor_entity$reference_id',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'IND03',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'S1 to S4',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'LogicalExpression',
        operator: '||',
        left: {
            type: 'BinaryExpression',
            operator: '==',
            left: {
                type: 'Identifier',
                name: 'sd_level',
                constant: false,
                toWatch: []
            },
            right: {
                type: 'Literal',
                value: 'S5',
                constant: true,
                toWatch: []
            },
            constant: false,
            toWatch: []
        },
        right: {
            type: 'BinaryExpression',
            operator: '==',
            left: {
                type: 'Identifier',
                name: 'sd_level',
                constant: false,
                toWatch: []
            },
            right: {
                type: 'Literal',
                value: 'S6',
                constant: true,
                toWatch: []
            },
            constant: false,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'S5',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'S6',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'S6',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'S5',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },
    {
        type: 'BinaryExpression',
        operator: '==',
        left: {
            type: 'Identifier',
            name: 'sd_level',
            constant: false,
            toWatch: [],
            watchId: 0
        },
        right: {
            type: 'Literal',
            value: 'L5 & L6',
            constant: true,
            toWatch: []
        },
        constant: false,
        toWatch: []
    },

];

module.exports = {
    astArray
}