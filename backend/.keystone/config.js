var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.js
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core21 = require("@keystone-6/core");
var import_express = __toESM(require("express"));
var import_dotenv3 = __toESM(require("dotenv"));

// schemas/userSchema.js
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");

// auth/access.js
function isSignedIn({ session: session2 }) {
  return Boolean(session2);
}
var permissions = {
  canCreateItems: ({ session: session2 }) => session2?.data.role?.canCreateItems ?? false,
  canManageAllItems: ({ session: session2 }) => session2?.data.role?.canManageAllItems ?? false,
  canManageUsers: ({ session: session2 }) => session2?.data.role?.canManageUsers ?? false,
  canManageRoles: ({ session: session2 }) => session2?.data.role?.canManageRoles ?? false
};
var rules = {
  canReadItems: ({ session: session2 }) => {
    if (!session2)
      return true;
    if (session2.data.role?.canManageAllItems) {
      return true;
    }
    return { author: { id: { equals: session2.itemId } } };
  },
  canManageItems: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canManageAllItems)
      return true;
    return { author: { id: { equals: session2.itemId } } };
  },
  canReadUsers: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canSeeOtherUsers)
      return true;
    return { id: { equals: session2.itemId } };
  },
  canUpdateUsers: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canEditOtherUsers)
      return true;
    return { id: { equals: session2.itemId } };
  }
};

// schemas/userSchema.js
var userSchema = (0, import_core.list)({
  access: {
    operation: {
      ...(0, import_access.allOperations)(isSignedIn),
      create: permissions.canManageUsers,
      delete: permissions.canManageUsers,
      query: () => true
    },
    filter: {
      query: rules.canReadUsers,
      update: rules.canUpdateUsers
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    labelField: "username",
    listView: {
      initialColumns: ["username", "email", "role"]
    },
    itemView: {
      defaultFieldMode: ({ session: session2, item }) => {
        if (session2?.data.role?.canEditOtherUsers)
          return "edit";
        if (session2?.itemId === item.id)
          return "edit";
        return "read";
      }
    }
  },
  fields: {
    username: (0, import_fields.text)({
      isFilterable: false,
      isOrderable: false,
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields.text)({
      isIndexed: "unique"
    }),
    password: (0, import_fields.password)({
      access: {
        read: import_access.denyAll,
        update: ({ session: session2, item }) => permissions.canManageUsers({ session: session2 }) || session2?.itemId === item.id
      },
      validation: { isRequired: true }
    }),
    chapters: (0, import_fields.relationship)({
      ref: "Chapter",
      many: true,
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      }
    }),
    //  Rolen som är kopplad till användare.
    role: (0, import_fields.relationship)({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      },
      ui: {
        itemView: {
          fieldMode: (args) => permissions.canManageUsers(args) ? "edit" : "read"
        }
      }
    })
  }
});

// schemas/roleSchema.js
var import_core2 = require("@keystone-6/core");
var import_access3 = require("@keystone-6/core/access");
var import_fields2 = require("@keystone-6/core/fields");
var roleSchema = (0, import_core2.list)({
  access: {
    operation: {
      ...(0, import_access3.allOperations)(permissions.canManageRoles),
      query: isSignedIn
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageRoles(args);
    },
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "assignedTo"]
    },
    itemView: {
      defaultFieldMode: (args) => permissions.canManageRoles(args) ? "edit" : "read"
    }
  },
  fields: {
    name: (0, import_fields2.text)({ validation: { isRequired: true } }),
    canCreateItems: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageAllItems: (0, import_fields2.checkbox)({ defaultValue: false }),
    canSeeOtherUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canEditOtherUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageUsers: (0, import_fields2.checkbox)({ defaultValue: false }),
    canManageRoles: (0, import_fields2.checkbox)({ defaultValue: false }),
    assignedTo: (0, import_fields2.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  }
});

// schemas/chapterSchema.js
var import_core3 = require("@keystone-6/core");
var import_fields3 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var import_access5 = require("@keystone-6/core/access");

// data/languageCodes.js
var languageCodesData = [
  { label: "Afghanistan", value: "AF" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia", value: "BO" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Brazil", value: "BR" },
  { label: "Brunei", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cabo Verde", value: "CV" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo (Congo-Brazzaville)", value: "CG" },
  { label: "Costa Rica", value: "CR" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Cyprus", value: "CY" },
  { label: "Czechia (Czech Republic)", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "English (Australia)", value: "EN-AU" },
  { label: "English (Canada)", value: "EN-CA" },
  { label: "English (United Kingdom)", value: "EN-GB" },
  { label: "English (United States)", value: "EN-US" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Eswatini", value: "SZ" },
  { label: "Ethiopia", value: "ET" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Greece", value: "GR" },
  { label: "Grenada", value: "GD" },
  { label: "Guatemala", value: "GT" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Holy See", value: "VA" },
  { label: "Honduras", value: "HN" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Israel", value: "IL" },
  { label: "Italy", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Laos", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia", value: "FM" },
  { label: "Moldova", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Morocco", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar (formerly Burma)", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "North Korea", value: "KP" },
  { label: "North Macedonia (formerly Macedonia)", value: "MK" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Palestine State", value: "PS" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Qatar", value: "QA" },
  { label: "Romania", value: "RO" },
  { label: "Russia", value: "RU" },
  { label: "Rwanda", value: "RW" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome and Principe", value: "ST" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Solomon Islands", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "South Africa", value: "ZA" },
  { label: "South Korea", value: "KR" },
  { label: "South Sudan", value: "SS" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Suriname", value: "SR" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Syria", value: "SY" },
  { label: "Taiwan", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania", value: "TZ" },
  { label: "Thailand", value: "TH" },
  { label: "Timor-Leste", value: "TL" },
  { label: "Togo", value: "TG" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Turkey", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States of America", value: "US" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Venezuela", value: "VE" },
  { label: "Vietnam", value: "VN" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" }
];

// utils/buildSlug.js
function buildSlug(input, subUrlType = "") {
  const map = {
    \u00E4: "a",
    \u00F6: "o",
    \u00E5: "a",
    \u00E9: "e",
    \u00E8: "e",
    \u00EA: "e",
    \u00EB: "e",
    \u00E0: "a",
    \u00E2: "a",
    \u00E6: "ae",
    \u00E7: "c",
    \u00EE: "i",
    \u00EF: "i",
    \u00F4: "o",
    \u0153: "oe",
    \u00FC: "u",
    \u00DF: "ss",
    \u00E1: "a",
    \u00ED: "i",
    \u00F3: "o",
    \u00FA: "u",
    \u00F1: "n"
  };
  let output = input.trim().toLowerCase().replace(/[^\w- ]+/g, function(char) {
    return map[char] || "";
  }).replace(/ +/g, "-").replace(/-+/g, "-").replace(/[\u0022\u0027]/g, "");
  let result;
  if (input.startsWith(`/${subUrlType}/`)) {
    const subUrlIndex = input.indexOf(`/${subUrlType}/`) + subUrlType.length + 2;
    const newUrl = input.substring(subUrlIndex);
    result = `/${subUrlType}/${newUrl}`;
  } else {
    result = `/${subUrlType}/${output}`;
  }
  if (!subUrlType) {
    result = `/${output}`;
  }
  return result;
}

// schemas/chapterSchema.js
var chapterSchema = (0, import_core3.list)({
  access: {
    operation: {
      ...(0, import_access5.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "title",
    listView: {
      initialColumns: [
        "title",
        "slug",
        "status",
        "chapterLanguage",
        "translatedChapters"
      ],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields3.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields3.text)({
      isIndexed: "unique",
      ui: {
        description: "The path name for the chapter. Must be unique. If not supplied, it will be generated from the title."
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.slug) {
            return buildSlug(inputData.title, "chapters");
          }
          if (operation === "create" && inputData.slug) {
            return buildSlug(inputData.slug, "chapters");
          }
          if (operation === "update" && inputData.slug) {
            return buildSlug(inputData.slug, "chapters");
          }
        }
      }
    }),
    preamble: (0, import_fields_document.document)({
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    }),
    heroImage: (0, import_fields3.json)({
      ui: {
        views: "./customViews/ImageLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    chapterLanguage: (0, import_fields3.select)({
      type: "string",
      defaultValue: "EN-GB",
      options: languageCodesData
    }),
    translatedChapters: (0, import_fields3.relationship)({
      ref: "Chapter",
      many: true,
      ui: {
        description: "Reference to the translated versions of this chapter."
      }
    }),
    status: (0, import_fields3.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    }),
    sections: (0, import_fields3.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/pageSchema.js
var import_core4 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var import_fields_document2 = require("@keystone-6/fields-document");
var import_access7 = require("@keystone-6/core/access");
var pageSchema = (0, import_core4.list)({
  access: {
    operation: {
      ...(0, import_access7.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "title",
    listView: {
      initialColumns: ["title", "slug", "status"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields4.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields4.text)({
      isIndexed: "unique",
      ui: {
        description: "The path name for the page. Must be unique. If not supplied, it will be generated from the title."
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.slug) {
            return buildSlug(inputData.title);
          }
          if (operation === "create" && inputData.slug) {
            return buildSlug(inputData.slug);
          }
          if (operation === "update" && inputData.slug) {
            return buildSlug(inputData.slug);
          }
        }
      }
    }),
    heroPreamble: (0, import_fields_document2.document)({
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    }),
    ctaOneAnchorText: (0, import_fields4.text)({
      label: "Call to action 1",
      ui: {
        description: "Anchor text for the call to action button."
      }
    }),
    ctaOneUrl: (0, import_fields4.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaTwoUrlAnchorText: (0, import_fields4.text)({
      label: "Call to action 2",
      ui: {
        description: "Anchor text for the call to action button."
      }
    }),
    ctaTwoUrl: (0, import_fields4.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    status: (0, import_fields4.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    }),
    sections: (0, import_fields4.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/frontPageSchema.js
var import_core5 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var import_fields_document3 = require("@keystone-6/fields-document");
var import_access9 = require("@keystone-6/core/access");
var frontPageSchema = (0, import_core5.list)({
  access: {
    operation: {
      ...(0, import_access9.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  isSingleton: true,
  fields: {
    heroTitle: (0, import_fields5.text)({ validation: { isRequired: true } }),
    heroPreamble: (0, import_fields_document3.document)({
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    }),
    heroVideo: (0, import_fields5.json)({
      ui: {
        views: "./customViews/VideoLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaOneAnchorText: (0, import_fields5.text)({
      label: "Call to action 1",
      ui: {
        description: "Anchor text for the call to action button."
      }
    }),
    ctaOneUrl: (0, import_fields5.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaTwoUrlAnchorText: (0, import_fields5.text)({
      label: "Call to action 2",
      ui: {
        description: "Anchor text for the call to action button."
      }
    }),
    ctaTwoUrl: (0, import_fields5.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    status: (0, import_fields5.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    }),
    sections: (0, import_fields5.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/footerBannerSchema.js
var import_core6 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var import_fields_document4 = require("@keystone-6/fields-document");
var import_access11 = require("@keystone-6/core/access");
var footerBannerSchema = (0, import_core6.list)({
  access: {
    operation: {
      ...(0, import_access11.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  isSingleton: true,
  fields: {
    title: (0, import_fields6.text)({ validation: { isRequired: true } }),
    preamble: (0, import_fields_document4.document)({
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    }),
    anchorText: (0, import_fields6.text)({
      label: "Call to action",
      ui: {
        description: "Anchor text for the call to action button."
      }
    }),
    url: (0, import_fields6.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    icon: (0, import_fields6.json)({
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/formEmailSchema.js
var import_core7 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var import_access13 = require("@keystone-6/core/access");

// utils/validateEmail.js
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// schemas/formEmailSchema.js
var formEmailSchema = (0, import_core7.list)({
  access: {
    operation: {
      ...(0, import_access13.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  isSingleton: true,
  fields: {
    contactEmail: (0, import_fields7.text)({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);
          if (email !== void 0 && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        }
      }
    }),
    newChapterEmail: (0, import_fields7.text)({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);
          if (email !== void 0 && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        }
      }
    }),
    joinSlackEmail: (0, import_fields7.text)({
      validation: { isRequired: true },
      hooks: {
        validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
          const email = resolvedData[fieldKey];
          const isEmailValid = validateEmail(email);
          if (email !== void 0 && email !== null && !isEmailValid) {
            addValidationError(
              `The email address ${email} provided for the field ${fieldKey} must be a valid email address.`
            );
          }
        }
      }
    })
  }
});

// schemas/footerJoinUsSchema.js
var import_core8 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var import_access15 = require("@keystone-6/core/access");
var footerJoinUsSchema = (0, import_core8.list)({
  access: {
    operation: {
      ...(0, import_access15.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  isSingleton: true,
  fields: {
    url1: (0, import_fields8.text)({
      validation: { isRequired: true },
      label: "Social Media URL 1"
    }),
    icon1: (0, import_fields8.json)({
      label: "Social Media Icon 1",
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url2: (0, import_fields8.text)({ validation: { isRequired: true }, label: "Social Media URL 2" }),
    icon2: (0, import_fields8.json)({
      label: "Social Media Icon 2",
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url3: (0, import_fields8.text)({ validation: { isRequired: true }, label: "Social Media URL 3" }),
    icon3: (0, import_fields8.json)({
      label: "Social Media Icon 3",
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url4: (0, import_fields8.text)({ validation: { isRequired: true }, label: "Social Media URL 4" }),
    icon4: (0, import_fields8.json)({
      label: "Social Media Icon 4",
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/newsSchema.js
var import_core9 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var import_access17 = require("@keystone-6/core/access");
var newsSchema = (0, import_core9.list)({
  access: {
    operation: {
      ...(0, import_access17.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  graphql: {
    plural: "NewsItems"
  },
  ui: {
    label: "News",
    singular: "News",
    plural: "News Items",
    path: "news",
    labelField: "title",
    listView: {
      initialColumns: ["title", "newsCategory", "newsNumber"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields9.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    slug: (0, import_fields9.text)({
      isIndexed: "unique",
      ui: {
        description: "The path name for the news. Must be unique. If not supplied, it will be generated from the title."
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.slug) {
            return buildSlug(inputData.title, "news");
          }
          if (operation === "create" && inputData.slug) {
            return buildSlug(inputData.slug, "news");
          }
          if (operation === "update" && inputData.slug) {
            return buildSlug(inputData.slug, "news");
          }
        }
      }
    }),
    newsCategory: (0, import_fields9.relationship)({
      validation: { isRequired: true },
      ref: "NewsCategory.relatedNews",
      many: false,
      ui: {
        description: "Reference to a news category."
      }
    }),
    relatedChapters: (0, import_fields9.relationship)({
      ref: "Chapter",
      many: true,
      ui: {
        description: "Reference to chapters."
      }
    }),
    image: (0, import_fields9.json)({
      ui: {
        views: "./customViews/ImageLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    status: (0, import_fields9.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    }),
    sections: (0, import_fields9.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    createdAt: (0, import_fields9.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/newsCategorySchema.js
var import_core10 = require("@keystone-6/core");
var import_fields10 = require("@keystone-6/core/fields");
var import_access19 = require("@keystone-6/core/access");
var newsCategorySchema = (0, import_core10.list)({
  access: {
    operation: {
      ...(0, import_access19.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "categoryTitle",
    listView: {
      initialColumns: ["categoryTitle", "createdAt"],
      initialSort: { field: "categoryTitle", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    categoryTitle: (0, import_fields10.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    createdAt: (0, import_fields10.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    }),
    relatedNews: (0, import_fields10.relationship)({
      ref: "News.newsCategory",
      many: true,
      ui: {
        description: "News belonging to this category."
      }
    })
  }
});

// schemas/resourceSchema.js
var import_core11 = require("@keystone-6/core");
var import_fields11 = require("@keystone-6/core/fields");
var import_access21 = require("@keystone-6/core/access");
var resourceSchema = (0, import_core11.list)({
  access: {
    operation: {
      ...(0, import_access21.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "title",
    listView: {
      initialColumns: ["title", "category", "type", "createdAt"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields11.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    url: (0, import_fields11.text)({ validation: { isRequired: true } }),
    image: (0, import_fields11.json)({
      ui: {
        views: "./customViews/ImageLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    category: (0, import_fields11.relationship)({
      validation: { isRequired: true },
      ref: "ResourceCategory.resources",
      many: false,
      ui: {
        description: "Reference to a category."
      }
    }),
    resourceType: (0, import_fields11.relationship)({
      validation: { isRequired: true },
      ref: "ResourceType.resources",
      many: false,
      ui: {
        description: "Reference to a type."
      }
    }),
    createdAt: (0, import_fields11.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/resourceCategorySchema.js
var import_core12 = require("@keystone-6/core");
var import_fields12 = require("@keystone-6/core/fields");
var import_access23 = require("@keystone-6/core/access");
var resourceCategorySchema = (0, import_core12.list)({
  access: {
    operation: {
      ...(0, import_access23.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    title: (0, import_fields12.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    createdAt: (0, import_fields12.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    }),
    resources: (0, import_fields12.relationship)({
      ref: "Resource.category",
      many: true,
      ui: {
        description: "Resources belonging to this category."
      }
    })
  }
});

// schemas/resourceTypeSchema.js
var import_core13 = require("@keystone-6/core");
var import_fields13 = require("@keystone-6/core/fields");
var import_access25 = require("@keystone-6/core/access");
var resourceTypeSchema = (0, import_core13.list)({
  access: {
    operation: {
      ...(0, import_access25.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "type",
    listView: {
      initialColumns: ["type", "icon"],
      initialSort: { field: "type", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    type: (0, import_fields13.text)({ validation: { isRequired: true } }),
    icon: (0, import_fields13.json)({
      label: "Icon",
      validation: { isRequired: true },
      ui: {
        views: "./customViews/IconPickerSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    resources: (0, import_fields13.relationship)({
      ref: "Resource.resourceType",
      many: true,
      ui: {
        description: "Resources belonging to this type."
      }
    })
  }
});

// schemas/principleSchema.js
var import_core14 = require("@keystone-6/core");
var import_fields14 = require("@keystone-6/core/fields");
var import_access27 = require("@keystone-6/core/access");
var principleSchema = (0, import_core14.list)({
  access: {
    operation: {
      ...(0, import_access27.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "title",
    listView: {
      initialColumns: ["title", "principleNumber", "principleCategory", "slug", "status"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields14.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields14.text)({
      isIndexed: "unique",
      ui: {
        description: "The path name for the principle. Must be unique. If not supplied, it will be generated from the principle number."
      },
      hooks: {
        resolveInput: async ({ operation, resolvedData, inputData, item }) => {
          let principleNumber = null;
          try {
            const response = await fetch(process.env.API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                query: `
                  query Query($where: PrincipleNumberWhereUniqueInput!) {
                    principleNumber(where: $where) {
                      number
                    }
                  }
                `,
                variables: {
                  where: {
                    id: inputData.principleNumber?.connect?.id || item.principleNumberId
                  }
                }
              })
            });
            const { data } = await response.json();
            principleNumber = data.principleNumber.number;
          } catch (error) {
            console.error(error);
          }
          if (operation === "create" && !inputData.slug) {
            return buildSlug(`principle-${principleNumber.toString()}`);
          }
          if (operation === "create" && inputData.slug) {
            return buildSlug(inputData.slug);
          }
          if (operation === "update" && inputData.slug) {
            return buildSlug(inputData.slug);
          }
          if (operation === "update" && !inputData.slug) {
            return buildSlug(`principle-${principleNumber.toString()}`);
          }
        }
      }
    }),
    subHeader: (0, import_fields14.text)({}),
    quote: (0, import_fields14.text)({}),
    quoteAuthor: (0, import_fields14.text)({}),
    image: (0, import_fields14.json)({
      ui: {
        views: "./customViews/ImageLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    subPrinciples: (0, import_fields14.json)({
      ui: {
        views: "./customViews/SubPrinciples.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    resources: (0, import_fields14.json)({
      ui: {
        views: "./customViews/Resources.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    principleCategory: (0, import_fields14.relationship)({
      ref: "PrincipleCategory.principles",
      many: true,
      ui: {
        description: "Reference to principle category."
      }
    }),
    principleNumber: (0, import_fields14.relationship)({
      validation: { isRequired: true },
      ref: "PrincipleNumber.principles",
      many: false,
      ui: {
        description: "Reference to principle number."
      }
    }),
    status: (0, import_fields14.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    })
  }
});

// schemas/principleNumberSchema.js
var import_core15 = require("@keystone-6/core");
var import_fields15 = require("@keystone-6/core/fields");
var import_access29 = require("@keystone-6/core/access");
var principleNumberSchema = (0, import_core15.list)({
  access: {
    operation: {
      ...(0, import_access29.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "number"
  },
  fields: {
    number: (0, import_fields15.integer)({ isIndexed: "unique", validation: { isRequired: true } }),
    principles: (0, import_fields15.relationship)({
      ref: "Principle.principleNumber",
      many: false,
      ui: {
        description: "Principle belonging to this number."
      }
    })
  }
});

// schemas/principleCategorySchema.js
var import_core16 = require("@keystone-6/core");
var import_fields16 = require("@keystone-6/core/fields");
var import_access31 = require("@keystone-6/core/access");
var principleCategorySchema = (0, import_core16.list)({
  access: {
    operation: {
      ...(0, import_access31.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    title: (0, import_fields16.text)({ isIndexed: "unique", validation: { isRequired: true } }),
    createdAt: (0, import_fields16.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    }),
    principles: (0, import_fields16.relationship)({
      ref: "Principle.principleCategory",
      many: true,
      ui: {
        description: "Principles belonging to this category."
      }
    })
  }
});

// schemas/caseSchema.js
var import_core17 = require("@keystone-6/core");
var import_fields17 = require("@keystone-6/core/fields");
var import_fields_document5 = require("@keystone-6/fields-document");
var import_access33 = require("@keystone-6/core/access");
var caseSchema = (0, import_core17.list)({
  access: {
    operation: {
      ...(0, import_access33.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  ui: {
    labelField: "title",
    listView: {
      initialColumns: ["title", "principleNumber", "principleCategory", "slug", "status"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields17.text)({ validation: { isRequired: true } }),
    slug: (0, import_fields17.text)({
      isIndexed: "unique",
      ui: {
        description: "The path name for the case. Must be unique. If not supplied, it will be generated from the title."
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.slug) {
            return buildSlug(inputData.title, "cases");
          }
          if (operation === "create" && inputData.slug) {
            return buildSlug(inputData.slug, "cases");
          }
          if (operation === "update" && inputData.slug) {
            return buildSlug(inputData.slug, "cases");
          }
        }
      }
    }),
    preamble: (0, import_fields_document5.document)({
      links: true,
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    }),
    sections: (0, import_fields17.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    caseImage: (0, import_fields17.json)({
      ui: {
        views: "./customViews/ImageLibrary.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    quote: (0, import_fields17.text)({}),
    caseLink: (0, import_fields17.json)({
      ui: {
        views: "./customViews/DynamicLinkSection.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    principles: (0, import_fields17.json)({
      ui: {
        views: "./customViews/Principles.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    resources: (0, import_fields17.json)({
      ui: {
        views: "./customViews/Resources.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    status: (0, import_fields17.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: { displayMode: "segmented-control" }
    }),
    createdAt: (0, import_fields17.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/imageSchema.js
var import_core18 = require("@keystone-6/core");
var import_fields18 = require("@keystone-6/core/fields");
var import_access35 = require("@keystone-6/core/access");
var imageSchema = (0, import_core18.list)({
  access: {
    operation: {
      ...(0, import_access35.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    title: (0, import_fields18.text)(),
    alt: (0, import_fields18.text)(),
    file: (0, import_fields18.image)({ storage: "imageStorage" }),
    createdAt: (0, import_fields18.timestamp)({ isRequired: true, defaultValue: { kind: "now" } }),
    size: (0, import_fields18.integer)({
      ui: {
        createView: {
          fieldMode: "hidden"
        },
        itemView: {
          fieldMode: "read"
        }
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create") {
            return resolvedData.file.filesize;
          }
        }
      }
    }),
    url: (0, import_fields18.text)({
      ui: {
        createView: {
          fieldMode: "hidden"
        },
        itemView: {
          fieldMode: "read"
        }
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          let url = process.env.IMAGE_URL;
          if (operation === "create") {
            return `${url}/${resolvedData.file.id}.${resolvedData.file.extension}`;
          }
        }
      }
    })
  }
});

// schemas/videoSchema.js
var import_core19 = require("@keystone-6/core");
var import_fields19 = require("@keystone-6/core/fields");
var import_access37 = require("@keystone-6/core/access");
var videoSchema = (0, import_core19.list)({
  access: {
    operation: {
      ...(0, import_access37.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    title: (0, import_fields19.text)(),
    alt: (0, import_fields19.text)(),
    file: (0, import_fields19.file)({
      storage: "videoStorage"
    }),
    createdAt: (0, import_fields19.timestamp)({ isRequired: true, defaultValue: { kind: "now" } }),
    size: (0, import_fields19.integer)({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create") {
            return resolvedData.file.filesize;
          }
        }
      }
    }),
    thumbnailUrl: (0, import_fields19.text)({}),
    url: (0, import_fields19.text)({
      ui: {
        itemView: {
          fieldMode: "read"
        }
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          let url = process.env.MEDIA_URL;
          if (operation === "create") {
            return `${url}/${resolvedData.file.filename}`;
          }
        }
      }
    })
  }
});

// schemas/testSchema.js
var import_core20 = require("@keystone-6/core");
var import_fields20 = require("@keystone-6/core/fields");
var import_access39 = require("@keystone-6/core/access");
var testSchema = (0, import_core20.list)({
  access: {
    operation: {
      ...(0, import_access39.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: () => true,
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  fields: {
    title: (0, import_fields20.text)(),
    // image: json({
    //   ui: {
    //     views: './customViews/MediaLibrary.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    sections: (0, import_fields20.json)({
      ui: {
        views: "./customViews/AllSections.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    principles: (0, import_fields20.json)({
      ui: {
        views: "./customViews/Principles.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
    // resources: json({
    //   ui: {
    //     views: './customViews/Resources.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
  }
});

// schema.js
var lists = {
  User: userSchema,
  Role: roleSchema,
  Chapter: chapterSchema,
  Page: pageSchema,
  FrontPage: frontPageSchema,
  FooterBanner: footerBannerSchema,
  FormEmail: formEmailSchema,
  FooterJoinUs: footerJoinUsSchema,
  News: newsSchema,
  NewsCategory: newsCategorySchema,
  Resource: resourceSchema,
  ResourceCategory: resourceCategorySchema,
  ResourceType: resourceTypeSchema,
  Image: imageSchema,
  Video: videoSchema,
  Principle: principleSchema,
  PrincipleNumber: principleNumberSchema,
  PrincipleCategory: principleCategorySchema,
  Case: caseSchema,
  Test: testSchema
};

// storage/imageStorage.js
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var imageStorage = {
  kind: "local",
  type: "image",
  generateUrl: (path) => `/public/images/${path}`,
  serverRoute: {
    path: "public/images"
  },
  storagePath: "public/images"
};

// storage/videoStorage.js
var import_dotenv2 = __toESM(require("dotenv"));
import_dotenv2.default.config();
var { MEDIA_URL } = process.env;
var videoStorage = {
  kind: "local",
  type: "file",
  generateUrl: (path) => `/public/media/${path}`,
  serverRoute: {
    path: "public/media"
  },
  storagePath: "public/media"
};

// storage.js
var storage = {
  imageStorage,
  videoStorage
};

// auth/auth.js
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var sessionMaxAge = process.env.SESSION_MAX_AGE;
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  // Ett identity field på usern.
  identityField: "username",
  secretField: "password",
  initFirstItem: {
    fields: ["username", "password"],
    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: "Admin Role",
          canCreateItems: true,
          canManageAllItems: true,
          canSeeOtherUsers: true,
          canEditOtherUsers: true,
          canManageUsers: true,
          canManageRoles: true
        }
      }
    }
  },
  sessionData: `
    username
    role {
      id
      name
      canCreateItems
      canManageAllItems
      canSeeOtherUsers
      canEditOtherUsers
      canManageUsers
      canManageRoles
    }`
});
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.js
import_dotenv3.default.config();
var { PORT, MAX_FILE_SIZE, DATABASE_URL, BASE_URL, API_URL } = process.env;
var keystone_default = withAuth(
  (0, import_core21.config)({
    server: {
      port: PORT,
      maxFileSize: MAX_FILE_SIZE,
      cors: { origin: ["*"], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.use(import_express.default.json());
        app.use("/public", import_express.default.static("public"));
      }
    },
    db: {
      provider: "mysql",
      url: DATABASE_URL,
      idField: { kind: "uuid" }
    },
    lists,
    session,
    storage,
    ui: { publicPages: ["public"] }
  })
);
//# sourceMappingURL=config.js.map
