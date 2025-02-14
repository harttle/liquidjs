const format_options = {
    "q1": {
        "type": "string",
        "label": "Q1",
        "placeholder": "Set Default Value"
    },
    "date": {
        "type": "date",
        "label": "Date",
        "default": "2023-11-08"
    },
    "para": {
        "type": "rich-text",
        "label": "Para"
    },
    "image": {
        "type": "image",
        "label": "Image",
        "isVariableCritical": true,
        "supportedExtensions": [
            "JPEG",
            "JPG",
            "PNG"
        ]
    },
    "title": {
        "type": "string",
        "label": "Title",
        "placeholder": "Set Default Value"
    },
    "number": {
        "type": "number",
        "label": "Number",
        "isVariableCritical": true
    },
    "address": {
        "type": "address",
        "label": "Address",
        "required": false
    },
    "currency": {
        "type": "currency",
        "label": "Currency",
        "isVariableCritical": true
    },
    "dropdown": {
        "type": "dropdown",
        "label": "Dropdown",
        "options": [
            {
                "label": "dropdown option 1",
                "value": "dropdown option 1"
            },
            {
                "label": "dropdown option 2",
                "value": "dropdown option 2"
            },
            {
                "label": "dropdown option 3",
                "value": "dropdown option 3"
            },
            {
                "label": "SANKETS",
                "value": "sankets"
            },
            {
                "label": "Mishra",
                "value": "mishra"
            }
        ],
        "placeholder": "Set Default Value",
        "optionGroups": []
    },
    "duration": {
        "type": "duration",
        "label": "Duration"
    },
    "parapara": {
        "type": "rich-text",
        "label": "Parapara"
    },
    "paragraph": {
        "type": "text-box",
        "label": "Paragraph",
        "isVariableCritical": true
    },
    "yes_or_no": {
        "type": "check-box",
        "label": "Yes Or No",
        "isVariableCritical": true
    },
    "phone_number": {
        "type": "phone-number",
        "label": "Phone Number",
        "isVariableCritical": true
    },
    "short_answer": {
        "type": "string",
        "label": "Short Answer",
        "isVariableCritical": true
    },
    "dynamic_table": {
        "type": "repeating",
        "label": "Dynamic Table",
        "default": [],
        "attributes": {
            "column1": {
                "type": "string",
                "label": "column1",
                "required": false
            },
            "currency": {
                "type": "currency",
                "label": "currency",
                "required": false
            }
        }
    },
    "party_one$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "party_two$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "date_wo_default": {
        "type": "date",
        "label": "Date Wo Default"
    },
    "subscriber$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "related_contract": {
        "type": "related-contract",
        "label": "Related Contract",
        "documentSource": "BOTH"
    },
    "supporting_documents": {
        "type": "multi-file",
        "label": "Supporting Documents",
        "multiple": true,
        "maxFileCount": 10,
        "fileSizeLimitInMb": 30,
        "isVariableCritical": true,
        "supportedExtensions": [
            "DOCX",
            "DOC",
            "JPEG",
            "JPG",
            "PNG",
            "PPT",
            "PPTX",
            "XLS",
            "XLSX",
            "PDF",
            "GIF",
            "TXT",
            "ODP",
            "KEY",
            "ASICE"
        ]
    },
    "ud_counterparty$name": {
        "type": "string",
        "label": "counterparty Name",
        "isBackend": true
    },
    "multi_select_dropdown": {
        "type": "multi-dropdown",
        "label": "Multi Select Dropdown",
        "options": [
            {
                "label": "Multi-select Dropdown option 1",
                "value": "Multi-select Dropdown option 1"
            },
            {
                "label": "Multi-select Dropdown option 2",
                "value": "Multi-select Dropdown option 2"
            },
            {
                "label": "Multi-select Dropdown option 3",
                "value": "Multi-select Dropdown option 3"
            }
        ],
        "placeholder": "Set Default Value",
        "optionGroups": []
    },
    "contractor_entity$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_creator_entity$name": {
        "type": "string",
        "label": "creator Name",
        "isBackend": true
    },
    "contract$execution_date": {
        "type": "date",
        "label": "Execution Date",
        "isBackend": true
    },
    "contractor_signatory$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "paragraph_with_formatting": {
        "type": "rich-text",
        "label": "Paragraph With Formatting",
        "placeholder": "Set Default Value"
    },
    "subscriber_signatory$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_creator$address$inline": {
        "type": "string",
        "label": "creator Address",
        "isBackend": true
    },
    "ud_creator_signatory$name": {
        "type": "string",
        "label": "creator Name",
        "isBackend": true
    },
    "contractor_address$zipcode": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$email": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$zipcode": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$email": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_creator_signatory$email": {
        "type": "string",
        "label": "creator Email",
        "isBackend": true
    },
    "contract$proposal_send_date": {
        "type": "date",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "formatting": "MMMM D, YYYY",
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$line_one": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$lint_two": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$line_one": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$lint_two": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$city$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$city$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$gst_number": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$gst_number": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_counterparty$address$inline": {
        "type": "string",
        "label": "counterparty Address",
        "isBackend": true
    },
    "ud_counterparty_signatory$name": {
        "type": "string",
        "label": "counterparty Name",
        "isBackend": true
    },
    "ud_creator_entity$reference_id": {
        "type": "string",
        "label": "creator Reference ID",
        "isBackend": true
    },
    "contractor_address$country$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$country$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_counterparty_signatory$email": {
        "type": "string",
        "label": "counterparty Email",
        "isBackend": true
    },
    "contractor_address$country$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$designation": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "party_one$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "party_two$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$country$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$designation": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_creator$organization_type$name": {
        "type": "string",
        "label": "creator Organization Type",
        "isBackend": true
    },
    "contractor_address$city$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$country$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$city$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$country$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_entity$jurisdiction$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_creator_entity$jurisdiction$name": {
        "type": "string",
        "label": "creator Jurisdiction Name",
        "isBackend": true
    },
    "contractor_signatory$address$zipcode": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$zipcode": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_counterparty$organization_type$id": {
        "type": "number",
        "label": "counterparty Nature",
        "isBackend": true
    },
    "contractor_address$city$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$line_one": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$lint_two": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$city$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$line_one": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$lint_two": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$city$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$city$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "ud_counterparty$jurisdiction_type$name": {
        "type": "string",
        "label": "counterparty Jurisdiction Type",
        "isBackend": true
    },
    "ud_counterparty$organization_type$name": {
        "type": "string",
        "label": "counterparty Organization Type",
        "isBackend": true
    },
    "contractor_signatory$address$gst_number": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$gst_number": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$city$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_address$country$currency_name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_entity$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$city$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_address$country$currency_name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$country$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$country$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$country$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$country$phone": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$organization_type$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$city$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$country$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$city$state$name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$country$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$city$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$city$state$capital": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$city$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "contractor_signatory$address$country$currency_name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$city$state$state_code": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    },
    "subscriber_signatory$address$country$currency_name": {
        "type": "string",
        "label": "",
        "helpText": "",
        "isBackend": true,
        "placeholder": "",
        "requiredOptions": {
            "type": "Static",
            "byParty": null,
            "expression": "false"
        },
        "isVariableCritical": true,
        "visibleToContractor": true,
        "visibleToSubscriber": true,
        "overrideUniversalConfig": false,
        "isCurrentlyRequiredByUser": false
    }
}

module.exports = {
    format_options
}