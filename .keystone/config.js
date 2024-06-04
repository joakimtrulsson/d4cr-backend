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
var import_dotenv = __toESM(require("dotenv"));
var import_core28 = require("@keystone-6/core");
var import_express = __toESM(require("express"));
var import_express_rate_limit = require("express-rate-limit");

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
  canCreateChapters: ({ session: session2 }) => session2?.data.role?.canCreateChapters ?? false,
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
    return { contentOwner: { some: { id: { equals: session2.itemId } } } };
  },
  canManageItems: ({ session: session2 }) => {
    if (!session2)
      return false;
    if (session2.data.role?.canManageAllItems)
      return true;
    return { contentOwner: { some: { id: { equals: session2.itemId } } } };
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
    // isHidden: (args) => {
    //   return !permissions?.canManageRoles(args);
    // },
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
    labelField: "email",
    listView: {
      initialColumns: ["email", "fullName", "role"]
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
    fullName: (0, import_fields.text)({
      isFilterable: false,
      isOrderable: false,
      // isIndexed: 'unique',
      validation: {
        isRequired: true
      }
    }),
    email: (0, import_fields.text)({
      isIndexed: "unique",
      validation: {
        isRequired: true
      }
    }),
    password: (0, import_fields.password)({
      access: {
        read: import_access.denyAll,
        update: ({ session: session2, item }) => permissions.canManageUsers({ session: session2 }) || session2?.itemId === item.id
      },
      validation: { isRequired: true }
    }),
    chapters: (0, import_fields.relationship)({
      ref: "Chapter.contentOwner",
      many: true,
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      },
      ui: {
        itemView: {
          fieldMode: (args) => permissions.canManageUsers(args) ? "edit" : "read"
        }
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
    canCreateChapters: (0, import_fields2.checkbox)({ defaultValue: false }),
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
var import_core4 = require("@keystone-6/core");

// utils/languageCodes.js
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

// utils/triggerRevalidation.js
async function triggerRevalidation(contentToUpdate) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}api/revalidate?path=${contentToUpdate}`,
      {
        method: "GET",
        headers: {
          "Access-Control-Allow-Headers": "Authorization",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STATIC_REVALIDATE_TOKEN}`
        }
      }
    );
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error("Error in triggerRevalidation:", error);
    return { response: { status: 500 }, data: { revalidated: false } };
  }
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
      query: ({ session: session2 }) => {
        if (session2) {
          return true;
        }
        return { status: { equals: "published" } };
      },
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update") {
        const { data } = await triggerRevalidation(item.slug);
      }
    }
  },
  ui: {
    hideCreate: (args) => !permissions.canCreateChapters(args),
    hideDelete: (args) => !permissions.canManageAllItems(args),
    // Om användaren har canManageAllItems så kan de redigera alla Chapters.
    // Annars så kan de bara uppdatera sitt egna Chapters.
    itemView: {
      defaultFieldMode: ({ session: session2, item }) => {
        if (session2?.data.role?.canManageAllItems)
          return "edit";
        if (session2.data.chapters[0].id === item.id)
          return "edit";
        return "read";
      }
    },
    labelField: "title",
    listView: {
      initialColumns: [
        "title",
        "slug",
        "contentOwner",
        "chapterLanguage",
        "translatedChapters",
        "status"
      ],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields3.text)({
      validation: { isRequired: true },
      ui: {
        description: 'This required field specifies the title of the chapter, which is prominently displayed below the image and "D4CR PRESENTS" on the chapter page. Additionally, the word "Chapter" will be rendered along with the title on the chapters page and will also appear in the browser tab.'
      }
    }),
    slug: (0, import_fields3.text)({
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
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
      ui: {
        description: "This field is required and is used to specify a short introductory text of the chapter. This text appears below the title and before the main content."
      },
      validation: { isRequired: true },
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
        description: 'This required field specifies the hero image for the chapter, which will be prominently displayed above the title and the text "D4CR PRESENTS". The hero image serves as a visual centerpiece.',
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: {
          fieldMode: ({ session: session2, item }) => {
            if (session2?.data.role?.canManageAllItems)
              return "edit";
            if (session2.data.chapters[0].id === item.id)
              return "edit";
            return "hidden";
          }
        }
      }
    }),
    chapterLanguage: (0, import_fields3.select)({
      ui: {
        description: "This required field specifies the language in which all text within the chapter is written. The selected language will be used not only for the content visible to users but also in the HTML for search engine optimization (SEO) and accessibility purposes."
      },
      type: "string",
      defaultValue: "EN-GB",
      options: languageCodesData
    }),
    translatedChapters: (0, import_fields3.relationship)({
      ref: "Chapter",
      many: true,
      ui: {
        description: "This required field allows for referencing the same chapter in another language. It enables the rendering of a button at the top of the chapters page, providing users with the option to navigate to the translated text."
      }
    }),
    status: (0, import_fields3.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: {
        description: 'This field determines the current status of the chapter. If set to "Draft," the chapter will not be available in the frontend application.',
        itemView: {
          fieldPosition: "sidebar"
        },
        displayMode: "segmented-control"
      }
    }),
    sections: (0, import_fields3.json)({
      ui: {
        views: "./customViews/fields/AllSectionsField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        // itemView: { fieldMode: 'edit' },
        itemView: {
          fieldMode: ({ session: session2, item }) => {
            if (session2?.data.role?.canManageAllItems)
              return "edit";
            if (session2.data.chapters[0].id === item.id)
              return "edit";
            return "hidden";
          }
        }
      }
    }),
    news: (0, import_fields3.virtual)({
      field: (lists2) => import_core4.graphql.field({
        type: import_core4.graphql.list(lists2.News.types.output),
        async resolve(item, args, context) {
          const newsData = await context.query.News.findMany({
            where: { relatedChapters: { some: { slug: { equals: item.slug } } } },
            orderBy: [{ createdAt: "desc" }],
            query: "id status createdAt newsCategory { categoryTitle } title slug image sections"
          });
          newsData.forEach((newsItem) => {
            if (typeof newsItem.createdAt === "string") {
              newsItem.createdAt = new Date(newsItem.createdAt);
            }
          });
          return newsData;
        }
      }),
      ui: {
        listView: {
          fieldMode: "hidden"
        },
        itemView: {
          fieldMode: "hidden"
        }
      }
    }),
    contentOwner: (0, import_fields3.relationship)({
      ref: "User.chapters",
      many: true,
      ui: {
        description: "This field specifies the users who is the content owners of the chapter. The content owner is responsible for creating and maintaining the chapter content.",
        createView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "hidden"
        },
        itemView: {
          fieldMode: (args) => permissions.canManageAllItems(args) ? "edit" : "read"
        }
      }
      // Default ska alltid nya items till den nuvarande användaren; detta är viktigt eftersom användare utan rättigheten canManageAllItems inte ser detta fält när de skapar nya.
      // hooks: {
      //   resolveInput({ operation, resolvedData, context }) {
      //     if (operation === 'create' && !resolvedData.contentOwner && context.session) {
      //       return { connect: { id: context.session.itemId } };
      //     }
      //     return resolvedData.assignedTo;
      //   },
      // },
    })
  }
});

// schemas/pageSchema.js
var import_core5 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var import_fields_document2 = require("@keystone-6/fields-document");
var import_access7 = require("@keystone-6/core/access");
var pageSchema = (0, import_core5.list)({
  access: {
    operation: {
      ...(0, import_access7.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: ({ session: session2 }) => {
        if (session2) {
          return true;
        }
        return { status: { equals: "published" } };
      },
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update") {
        const { data } = await triggerRevalidation(item.slug);
      }
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    labelField: "title",
    listView: {
      initialColumns: ["title", "slug", "status"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields4.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the title of the page, which appears at the top of the page, represents the name of the page and will also appear in the browser tab."
      }
    }),
    slug: (0, import_fields4.text)({
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
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
      ui: {
        description: "This is not required component of the page layout. A brief introductory text that complements the title."
      },
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
        description: "This field is not required and represents the anchor text for the primary call-to-action button, displayed with an orange background."
      }
    }),
    ctaOneUrl: (0, import_fields4.json)({
      ui: {
        views: "./customViews/fields/DynamicLinkField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaTwoUrlAnchorText: (0, import_fields4.text)({
      label: "Call to action 2",
      ui: {
        description: "This field is not required and represents the anchor text for the secondary call-to-action button, displayed with an white background."
      }
    }),
    ctaTwoUrl: (0, import_fields4.json)({
      ui: {
        views: "./customViews/fields/DynamicLinkField.jsx",
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
      ui: {
        description: 'This field determines the current status of the page. If set to "Draft," the page will not be available in the frontend application.',
        itemView: {
          fieldPosition: "sidebar"
        },
        displayMode: "segmented-control"
      }
    }),
    sections: (0, import_fields4.json)({
      ui: {
        views: "./customViews/fields/AllSectionsField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/frontPageSchema.js
var import_core6 = require("@keystone-6/core");
var import_fields5 = require("@keystone-6/core/fields");
var import_fields_document3 = require("@keystone-6/fields-document");
var import_access9 = require("@keystone-6/core/access");
var frontPageSchema = (0, import_core6.list)({
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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update") {
        const { data } = await triggerRevalidation("/");
      }
    }
  },
  fields: {
    heroTitle: (0, import_fields5.text)({
      validation: { isRequired: true },
      ui: {
        description: "This is required and serves as the main title or headline displayed on the hero section of the front page."
      }
    }),
    heroPreamble: (0, import_fields_document3.document)({
      validation: { isRequired: true },
      ui: {
        description: "This is a required component of the frontpage layout. A brief introductory text that complements the heroTitle."
      },
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
        views: "./customViews/fields/VideoLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaOneAnchorText: (0, import_fields5.text)({
      label: "Call to action 1",
      ui: {
        description: "This field represents the anchor text for the primary call-to-action button, displayed with an orange background."
      }
    }),
    ctaOneUrl: (0, import_fields5.json)({
      ui: {
        views: "./customViews/fields/DynamicLinkField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaTwoUrlAnchorText: (0, import_fields5.text)({
      label: "Call to action 2",
      ui: {
        description: "This field represents the anchor text for the secondary call-to-action button, displayed with an white background."
      }
    }),
    ctaTwoUrl: (0, import_fields5.json)({
      ui: {
        views: "./customViews/fields/DynamicLinkField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    sections: (0, import_fields5.json)({
      ui: {
        views: "./customViews/fields/AllSectionsField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/footerBannerSchema.js
var import_core7 = require("@keystone-6/core");
var import_fields6 = require("@keystone-6/core/fields");
var import_fields_document4 = require("@keystone-6/fields-document");
var import_access11 = require("@keystone-6/core/access");
var footerBannerSchema = (0, import_core7.list)({
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
    title: (0, import_fields6.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the title of the footer banner, which appears at the just above of the footer."
      }
    }),
    preamble: (0, import_fields_document4.document)({
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the preamble of the footer banner."
      },
      formatting: {
        inlineMarks: {
          bold: true,
          italic: true,
          underline: true,
          strikethrough: true
        },
        softBreaks: true
      }
    })
  }
});

// schemas/formEmailSchema.js
var import_core8 = require("@keystone-6/core");
var import_fields7 = require("@keystone-6/core/fields");
var import_fields_document5 = require("@keystone-6/fields-document");
var import_access13 = require("@keystone-6/core/access");

// utils/validateEmail.js
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// schemas/formEmailSchema.js
var formEmailSchema = (0, import_core8.list)({
  ui: {
    label: "Form - Contact us"
  },
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
      ui: {
        description: 'This required field is utilized on the predefined page "/contact-us" to specify the email address to which the form submissions on that page should be sent.'
      },
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
    contactUsPreamble: (0, import_fields_document5.document)({
      ui: {
        description: "This field is required and is used to specify a short introductory text to the contact form."
      },
      hooks: {
        afterOperation: async ({ operation, context, listKey, item }) => {
          if (operation === "create" || operation === "update") {
            const { data } = await triggerRevalidation("/contact-us");
          }
        }
      },
      validation: { isRequired: true },
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
    shareStoryEmail: (0, import_fields7.text)({
      validation: { isRequired: true },
      ui: {
        description: 'This required field is used to define the email address that will receive submitted stories through the "Share Story" Modal form.'
      },
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
    shareStoryPreamble: (0, import_fields_document5.document)({
      ui: {
        description: "This field is required and is used to specify a short introductory text to the contact form."
      },
      validation: { isRequired: true },
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
    joinSlackEmail: (0, import_fields7.text)({
      validation: { isRequired: true },
      ui: {
        description: 'This required field is used to define the email address that will receive submitted stories through the "Join our Slack" Modal form.'
      },
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
    joinSlackPreamble: (0, import_fields_document5.document)({
      ui: {
        description: "This field is required and is used to specify a short introductory text to the contact form."
      },
      validation: { isRequired: true },
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
    })
  }
});

// schemas/footerJoinUsSchema.js
var import_core9 = require("@keystone-6/core");
var import_fields8 = require("@keystone-6/core/fields");
var import_access15 = require("@keystone-6/core/access");
var footerJoinUsSchema = (0, import_core9.list)({
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
      label: "Social Media URL 1",
      ui: {
        description: "This field is used to specify the URL of the social media 1."
      }
    }),
    icon1: (0, import_fields8.json)({
      label: "Social Media Icon 1",
      validation: { isRequired: true },
      ui: {
        description: "This field specifies the icon that represents the button to the social media link 1.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url2: (0, import_fields8.text)({
      label: "Social Media URL 2",
      ui: {
        description: "This field is used to specify the URL of the social media 2."
      }
    }),
    icon2: (0, import_fields8.json)({
      label: "Social Media Icon 2",
      ui: {
        description: "This field specifies the icon that represents the button to the social media link 2.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url3: (0, import_fields8.text)({
      label: "Social Media URL 3",
      ui: {
        description: "This field is used to specify the URL of the social media 3."
      }
    }),
    icon3: (0, import_fields8.json)({
      label: "Social Media Icon 3",
      ui: {
        description: "This field specifies the icon that represents the button to the social media link 3.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    url4: (0, import_fields8.text)({
      label: "Social Media URL 4",
      ui: {
        description: "This field is used to specify the URL of the social media 4."
      }
    }),
    icon4: (0, import_fields8.json)({
      label: "Social Media Icon 4",
      ui: {
        description: "This field specifies the icon that represents the button to the social media link 4.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/mainMenuSchema.js
var import_core10 = require("@keystone-6/core");
var import_fields9 = require("@keystone-6/core/fields");
var import_access17 = require("@keystone-6/core/access");
var mainMenuSchema = (0, import_core10.list)({
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
  isSingleton: true,
  fields: {
    navigation: (0, import_fields9.json)({
      ui: {
        views: "./customViews/fields/MainMenuField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ctaAnchorText: (0, import_fields9.text)({
      label: "Call to action",
      validation: { isRequired: true },
      ui: {
        description: "This required field represents the anchor text for the call-to-action button used in the top navigation bar."
      }
    }),
    ctaUrl: (0, import_fields9.json)({
      ui: {
        views: "./customViews/fields/DynamicLinkField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/footerMenuSchema.js
var import_core11 = require("@keystone-6/core");
var import_fields10 = require("@keystone-6/core/fields");
var import_access19 = require("@keystone-6/core/access");
var footerMenuSchema = (0, import_core11.list)({
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
  isSingleton: true,
  fields: {
    navigation: (0, import_fields10.json)({
      ui: {
        description: "Add and remove, items in the footer menu, which is placed beneth the social media links.",
        views: "./customViews/fields/FooterMenuField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    })
  }
});

// schemas/newsSchema.js
var import_core12 = require("@keystone-6/core");
var import_fields11 = require("@keystone-6/core/fields");
var import_core13 = require("@keystone-6/core");
var import_access21 = require("@keystone-6/core/access");
var newsSchema = (0, import_core12.list)({
  access: {
    operation: {
      ...(0, import_access21.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: ({ session: session2 }) => {
        if (session2) {
          return true;
        }
        return { status: { equals: "published" } };
      },
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  graphql: {
    plural: "NewsItems"
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update" || operation === "delete") {
        const url = operation === "delete" ? "/news" : item.slug;
        const { data } = await triggerRevalidation(url);
        if (data.revalidated)
          console.log("NextJs Revalidation triggered successfully");
      }
    }
  },
  ui: {
    label: "News",
    singular: "News",
    plural: "News Items",
    path: "news",
    labelField: "title",
    listView: {
      initialColumns: ["title", "newsCategory", "createdAt"],
      initialSort: { field: "createdAt", direction: "DESC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields11.text)({
      isIndexed: "unique",
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the title of the news, which appears at the top of the page, represents the name of the news and will also appear in the browser tab. Must be unique."
      }
    }),
    slug: (0, import_fields11.text)({
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
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
    newsCategory: (0, import_fields11.relationship)({
      validation: { isRequired: true },
      ref: "NewsCategory.relatedNews",
      many: false,
      ui: {
        description: 'This required field specifies the category assigned to the news. The news categories will be utilized in news sections, rendererd above the title on the news page and on the predefined page "/news" the user will be able to sort based on this category.'
      }
    }),
    relatedChapters: (0, import_fields11.relationship)({
      ref: "Chapter",
      many: true,
      ui: {
        description: "This field allows the editor to associate a news article with a specific chapter. By selecting related chapters, the news article becomes linked to the corresponding chapter."
      }
    }),
    image: (0, import_fields11.json)({
      ui: {
        description: 'This required field specifies the image for the news article. It will be rendered at the top of the news page and also in the news card on the predefined page "/news". ',
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    sections: (0, import_fields11.json)({
      ui: {
        views: "./customViews/fields/AllSectionsField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ...(0, import_core13.group)({
      label: "Resources",
      description: "Select resources to showcase in the designated resources section, consistently located at the bottom of the page. If no resources are chosen, the section will remain hidden.",
      fields: {
        resources: (0, import_fields11.relationship)({
          ref: "Resource",
          many: true,
          ui: {
            hideCreate: true,
            description: "Choose resources to be displayed in the resources section. Selected resources will be rendered in the order they are chosen."
          }
        })
      }
    }),
    createdAt: (0, import_fields11.timestamp)({
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
        description: "The date and time the news was created. If not supplied, the current date and time will be used."
      },
      isRequired: true,
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.createdAt) {
            let date = /* @__PURE__ */ new Date();
            date.setMilliseconds(0);
            return date.toISOString();
          } else if (operation === "update" && inputData.createdAt) {
            let date = new Date(inputData.createdAt);
            date.setMilliseconds(0);
            return date.toISOString();
          } else {
            let date = inputData.createdAt;
            date.setMilliseconds(0);
            return date.toISOString();
          }
        }
      }
    }),
    status: (0, import_fields11.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: {
        description: 'This field determines the current status of the news. If set to "Draft," the news will not be available in the frontend application.',
        itemView: {
          fieldPosition: "sidebar"
        },
        displayMode: "segmented-control"
      }
    })
  }
});

// schemas/newsCategorySchema.js
var import_core14 = require("@keystone-6/core");
var import_fields12 = require("@keystone-6/core/fields");
var import_access23 = require("@keystone-6/core/access");
var newsCategorySchema = (0, import_core14.list)({
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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update" || operation === "delete") {
        const { data } = await triggerRevalidation("/news");
      }
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
    categoryTitle: (0, import_fields12.text)({
      isIndexed: "unique",
      validation: { isRequired: true },
      ui: {
        description: "This required and unique field specifies the title of the news category. It will be used to categorize news articles and allow users to filter news based on categories."
      }
    }),
    createdAt: (0, import_fields12.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    }),
    relatedNews: (0, import_fields12.relationship)({
      ref: "News.newsCategory",
      many: true,
      ui: {
        description: "News belonging to this category."
      }
    })
  }
});

// schemas/resourceSchema.js
var import_core15 = require("@keystone-6/core");
var import_fields13 = require("@keystone-6/core/fields");
var import_access25 = require("@keystone-6/core/access");
var resourceSchema = (0, import_core15.list)({
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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update" || operation === "delete") {
        const { data } = await triggerRevalidation("/resources");
        if (data.revalidated) {
          console.log("NextJs Revalidation triggered successfully");
        }
      }
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
    title: (0, import_fields13.text)({
      isIndexed: "unique",
      validation: { isRequired: true },
      ui: {
        description: "This required field represents the title of the resource. It must be unique and serves as the primary identifier for the resource."
      }
    }),
    url: (0, import_fields13.text)({
      validation: { isRequired: true },
      ui: {
        description: 'This required field specifies the URL for the resource. It will be displayed as a link on the predefined page "/resources".'
      }
    }),
    image: (0, import_fields13.json)({
      ui: {
        description: 'This required field specifies the image for the resource. It will be rendered in the resource card on the predefined page "/resources". The image serves as a visual representation of the resource.',
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    resourceType: (0, import_fields13.relationship)({
      validation: { isRequired: true },
      ref: "ResourceType.resources",
      many: false,
      ui: {
        description: 'This required field specifies the type of the resource. It will be rendered in the resource card on the predefined page "/resources" and allows visitors to filter resources based on their type. '
      }
    }),
    createdAt: (0, import_fields13.timestamp)({
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
        description: "The date and time the news was created. If not supplied, the current date and time will be used."
      },
      isRequired: true,
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.createdAt) {
            let date = /* @__PURE__ */ new Date();
            date.setMilliseconds(0);
            return date.toISOString();
          } else if (operation === "update" && inputData.createdAt) {
            let date = new Date(inputData.createdAt);
            date.setMilliseconds(0);
            return date.toISOString();
          } else {
            let date = inputData.createdAt;
            date.setMilliseconds(0);
            return date.toISOString();
          }
        }
      }
    })
  }
});

// schemas/resourceTypeSchema.js
var import_core16 = require("@keystone-6/core");
var import_fields14 = require("@keystone-6/core/fields");
var import_access27 = require("@keystone-6/core/access");
var resourceTypeSchema = (0, import_core16.list)({
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
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (operation === "create" || operation === "update" || operation === "delete") {
        const { data } = await triggerRevalidation("/resources");
      }
    }
  },
  ui: {
    description: "This list is used to categorize resources based on their types.",
    labelField: "type",
    listView: {
      initialColumns: ["type", "icon"],
      initialSort: { field: "type", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    type: (0, import_fields14.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field specifies the type of resource. It will be used to categorize resources and allow users to filter resources based on types."
      }
    }),
    // icon: json({
    //   label: 'Icon',
    //   validation: { isRequired: true },
    //   ui: {
    //     description:
    //       'This required field specifies the icon that represents the type of resource.',
    //     views: './customViews/fields/IconPickerField.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    resources: (0, import_fields14.relationship)({
      ref: "Resource.resourceType",
      many: true,
      ui: {
        description: "Resources belonging to this type."
      }
    })
  }
});

// schemas/principleSchema.js
var import_core17 = require("@keystone-6/core");
var import_fields15 = require("@keystone-6/core/fields");
var import_core18 = require("@keystone-6/core");
var import_access29 = require("@keystone-6/core/access");
var principleSchema = (0, import_core17.list)({
  access: {
    operation: {
      ...(0, import_access29.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: ({ session: session2 }) => {
        if (session2) {
          return true;
        }
        return { status: { equals: "published" } };
      },
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      console.log(item.slug);
      if (operation === "create" || operation === "update") {
        const { data } = await triggerRevalidation(`/principles${item.slug}`);
      }
    }
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    labelField: "title",
    listView: {
      initialColumns: ["title", "principleNumber", "principleCategory", "slug", "status"],
      initialSort: { field: "title", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    title: (0, import_fields15.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the title of the principle, which appears at the top of the principle page, represents the name of the principle and will also appear in the browser tab."
      }
    }),
    slug: (0, import_fields15.text)({
      isIndexed: "unique",
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
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
    subHeader: (0, import_fields15.text)({
      label: "Related Rights",
      validation: {
        isRequired: true
      },
      ui: {
        description: "This required field is used to provide additional text that will be displayed beneath the title on the principle page as well as on principle sections.",
        displayMode: "textarea"
      }
    }),
    quote: (0, import_fields15.text)({
      ui: {
        description: "This field is utilized to display a quote that complements the title and subHeader at the top of the page."
      }
    }),
    quoteAuthor: (0, import_fields15.text)({
      ui: {
        description: "This field specifies the source or author of the quote displayed alongside the title, subHeader, and quote on the principle page."
      }
    }),
    image: (0, import_fields15.json)({
      ui: {
        description: "This field specifies the image that will be displayed beneath the quote on the page, as well as in Principle Sections. For optimal user experience, the image is recommended to have a transparent background.",
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    subPrinciples: (0, import_fields15.json)({
      ui: {
        description: "This required field specifies the bulletpoint list associated with the main principle. These bulletpoint will be displayed beneath the fields mentioned above, rendered as a list where each point is accompanied by a arrow icon pointing to the text.",
        views: "./customViews/fields/SubPrinciplesField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ...(0, import_core18.group)({
      label: "Resources",
      description: "Select resources to showcase in the designated resources section, consistently located at the bottom of the page. If no resources are chosen, the section will remain hidden.",
      fields: {
        resources: (0, import_fields15.relationship)({
          ref: "Resource",
          many: true,
          ui: {
            description: "Choose resources to be displayed in the resources section. Selected resources will be rendered in the order they are chosen."
          }
        })
      }
    }),
    ...(0, import_core18.group)({
      label: "Principle Taxonomy",
      description: "Select the principle category and number for this principle.",
      fields: {
        principleCategory: (0, import_fields15.relationship)({
          ref: "PrincipleCategory.principles",
          many: false,
          validation: { isRequired: true },
          ui: {
            description: "This required field specifies the category assigned to the principle. The principle categories will be utilized in principle sections to organize and list all principles accordingly. Principles will be sorted based on this category."
          }
        }),
        principleNumber: (0, import_fields15.relationship)({
          validation: { isRequired: true },
          ref: "PrincipleNumber.principles",
          many: false,
          ui: {
            description: "This required field assigns a unique number to each principle. It will be utilized in generating the principles slug and will be displayed alongside the title on the page and in principle sections. This number ensures each principle is distinctly identified and facilitates organized navigation and referencing throughout the site."
          }
        })
      }
    }),
    status: (0, import_fields15.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: {
        description: 'This field determines the current status of the principle. If set to "Draft," the principle will not be available in the frontend application.',
        itemView: {
          fieldPosition: "sidebar"
        },
        displayMode: "segmented-control"
      }
    })
  }
});

// schemas/principleNumberSchema.js
var import_core19 = require("@keystone-6/core");
var import_fields16 = require("@keystone-6/core/fields");
var import_access31 = require("@keystone-6/core/access");
var principleNumberSchema = (0, import_core19.list)({
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
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    labelField: "number"
  },
  fields: {
    number: (0, import_fields16.integer)({
      isIndexed: "unique",
      validation: { isRequired: true },
      ui: { description: "The numbers available to be selected for the principles." }
    }),
    principles: (0, import_fields16.relationship)({
      ref: "Principle.principleNumber",
      many: false,
      ui: {
        description: "Principles belonging to this number."
      }
    })
  }
});

// schemas/principleCategorySchema.js
var import_core20 = require("@keystone-6/core");
var import_fields17 = require("@keystone-6/core/fields");
var import_access33 = require("@keystone-6/core/access");
var principleCategorySchema = (0, import_core20.list)({
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
  fields: {
    title: (0, import_fields17.text)({
      isIndexed: "unique",
      validation: { isRequired: true },
      ui: { description: "The categories available to be selected for the principles." }
    }),
    createdAt: (0, import_fields17.timestamp)({
      isRequired: true,
      defaultValue: { kind: "now" }
    }),
    principles: (0, import_fields17.relationship)({
      ref: "Principle.principleCategory",
      many: true,
      ui: {
        description: "Principles belonging to this category."
      }
    })
  }
});

// schemas/caseSchema.js
var import_core21 = require("@keystone-6/core");
var import_fields18 = require("@keystone-6/core/fields");
var import_core22 = require("@keystone-6/core");
var import_fields_document6 = require("@keystone-6/fields-document");
var import_access35 = require("@keystone-6/core/access");
var caseSchema = (0, import_core21.list)({
  access: {
    operation: {
      ...(0, import_access35.allOperations)(isSignedIn),
      create: permissions.canCreateItems,
      query: () => true
    },
    filter: {
      query: ({ session: session2 }) => {
        if (session2) {
          return true;
        }
        return { status: { equals: "published" } };
      },
      // query: rules.canReadItems,
      update: rules.canManageItems,
      delete: rules.canManageItems
    }
  },
  hooks: {
    afterOperation: async ({ operation, context, listKey, item }) => {
      if (["create", "update", "delete"].includes(operation) && item.linkType === "internal") {
        const url = operation === "delete" ? "/cases" : item.url;
        const { data } = await triggerRevalidation(url);
      }
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
    title: (0, import_fields18.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field is used to specify the title of the case, which appears at the top of the page, represents the name of the case and will also appear in the browser tab."
      }
    }),
    linkType: (0, import_fields18.select)({
      isRequired: true,
      options: [
        { label: "Internal", value: "internal" },
        { label: "External", value: "external" },
        { label: "None", value: "none" }
      ],
      defaultValue: "internal",
      ui: {
        description: 'If "Internal" is selected, a separate page will be generated for the case. If "External" is selected, the case will only be rendered on the predefined "/cases" page with an external link. If "None" is selected, the case will also only be rendered on the predefined "/cases" page but without a link.',
        displayMode: "segmented-control"
      }
    }),
    url: (0, import_fields18.text)({
      ui: {
        itemView: {
          fieldPosition: "form"
        },
        description: "If Link type is external, this field must be filled with the URL of the external page. If Link type is internal, this field will be generated from the title."
      },
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData, item }) => {
          if (operation === "create" && resolvedData.linkType === "internal") {
            return buildSlug(inputData.title, "cases");
          }
          if (operation === "update" && resolvedData.linkType === "internal" && !inputData.url) {
            return buildSlug(item.title, "cases");
          } else if (operation === "update" && resolvedData.linkType === "internal" && inputData.url) {
            return buildSlug(inputData.title, "cases");
          }
          if (operation === "create" && resolvedData.linkType === "none") {
            return "";
          }
          if (operation === "update" && resolvedData.linkType === "none") {
            return "";
          }
          if (operation === "create" && resolvedData.linkType === "external") {
            return inputData.url;
          }
          if (operation === "update" && resolvedData.linkType === "external") {
            return inputData.url;
          }
        }
      }
    }),
    preamble: (0, import_fields_document6.document)({
      ui: {
        description: "This is not required component of the case layout. A brief introductory text that complements the title."
      },
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
    caseImage: (0, import_fields18.json)({
      ui: {
        description: 'This required image will only be displayed on the predefined page "/cases". It is used to illustrate the case in a case card ',
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    quote: (0, import_fields18.text)({
      validation: { isRequired: true },
      ui: {
        description: 'This required quote will only be rendered on the predefined page "/cases" and will serve as the descriptive text for the case.'
      }
    }),
    sections: (0, import_fields18.json)({
      ui: {
        views: "./customViews/fields/AllSectionsField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    ...(0, import_core22.group)({
      label: "Resources",
      description: "Select resources to showcase in the designated resources section, consistently located at the bottom of the page. If no resources are chosen, the section will remain hidden.",
      fields: {
        resources: (0, import_fields18.relationship)({
          ref: "Resource",
          many: true,
          ui: {
            hideCreate: true,
            description: "Choose resources to be displayed in the resources section. Selected resources will be rendered in the order they are chosen."
          }
        })
      }
    }),
    status: (0, import_fields18.select)({
      options: [
        { label: "Published", value: "published" },
        { label: "Draft", value: "draft" }
      ],
      validation: { isRequired: true },
      defaultValue: "draft",
      ui: {
        description: 'This field determines the current status of the case. If set to "Draft," the case will not be available in the frontend application.',
        itemView: {
          fieldPosition: "sidebar"
        },
        displayMode: "segmented-control"
      }
    }),
    createdAt: (0, import_fields18.timestamp)({
      ui: {
        itemView: {
          fieldPosition: "sidebar"
        },
        description: "The date and time the news was created. If not supplied, the current date and time will be used."
      },
      isRequired: true,
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.createdAt) {
            let date = /* @__PURE__ */ new Date();
            date.setMilliseconds(0);
            return date.toISOString();
          } else if (operation === "update" && inputData.createdAt) {
            let date = new Date(inputData.createdAt);
            date.setMilliseconds(0);
            return date.toISOString();
          } else {
            let date = inputData.createdAt;
            date.setMilliseconds(0);
            return date.toISOString();
          }
        }
      }
    })
  }
});

// schemas/peopleSchema.js
var import_core23 = require("@keystone-6/core");
var import_fields19 = require("@keystone-6/core/fields");
var import_access37 = require("@keystone-6/core/access");
var peopleSchema = (0, import_core23.list)({
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
  labelField: "fullName",
  graphql: {
    plural: "PeopleList"
  },
  ui: {
    isHidden: (args) => {
      return !permissions?.canManageAllItems(args);
    },
    listView: {
      initialColumns: ["fullName", "role", "city", "country"],
      initialSort: { field: "fullName", direction: "ASC" },
      pageSize: 50
    }
  },
  fields: {
    fullName: (0, import_fields19.text)({ validation: { isRequired: true } }),
    role: (0, import_fields19.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field specifies the role or position of the person, which will be rendered beneath the name on the Person Card. "
      }
    }),
    city: (0, import_fields19.text)({ validation: { isRequired: true } }),
    country: (0, import_fields19.text)({ validation: { isRequired: true } }),
    image: (0, import_fields19.json)({
      ui: {
        description: "This field specifies the image of the person.",
        views: "./customViews/fields/ImageLibraryField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    socialMediaUrl1: (0, import_fields19.text)({
      label: "Socialmedia Link 1",
      ui: {
        description: "Url"
      }
    }),
    socialMediaIcon1: (0, import_fields19.json)({
      label: "Socialmedia icon 1",
      ui: {
        description: "This field specifies the icon for the first social media link.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    socialMediaUrl2: (0, import_fields19.text)({
      label: "Socialmedia Link 2",
      ui: {
        description: "Url"
      }
    }),
    socialMediaIcon2: (0, import_fields19.json)({
      label: "Socialmedia icon 2",
      ui: {
        description: "This field specifies the icon for the second social media link.",
        views: "./customViews/fields/IconPickerField.jsx",
        createView: { fieldMode: "edit" },
        listView: { fieldMode: "hidden" },
        itemView: { fieldMode: "edit" }
      }
    }),
    createdAt: (0, import_fields19.timestamp)({
      ui: {
        itemView: { fieldMode: "hidden" }
      },
      isRequired: true,
      defaultValue: { kind: "now" }
    })
  }
});

// schemas/imageSchema.js
var import_core24 = require("@keystone-6/core");
var import_fields20 = require("@keystone-6/core/fields");
var import_access39 = require("@keystone-6/core/access");
var imageSchema = (0, import_core24.list)({
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
    title: (0, import_fields20.text)({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.title) {
            return resolvedData.file.id;
          }
          if (operation === "update" && !resolvedData.title) {
            return resolvedData.file.id;
          }
          return resolvedData.title;
        }
      },
      ui: {
        description: "This field specifies the title of the image, which is automatically generated from the uploaded image URL.",
        itemView: {
          fieldMode: "read"
        }
      }
    }),
    altText: (0, import_fields20.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field specifies the alternative text for the image. Alt text provides a textual description of the image, which is essential for accessibility and SEO purpose."
      }
    }),
    file: (0, import_fields20.image)({ label: "Image", storage: "imageStorage" }),
    createdAt: (0, import_fields20.timestamp)({ isRequired: true, defaultValue: { kind: "now" } }),
    size: (0, import_fields20.integer)({
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
    url: (0, import_fields20.text)({
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
var import_core25 = require("@keystone-6/core");
var import_fields21 = require("@keystone-6/core/fields");
var import_access41 = require("@keystone-6/core/access");
var videoSchema = (0, import_core25.list)({
  access: {
    operation: {
      ...(0, import_access41.allOperations)(isSignedIn),
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
    title: (0, import_fields21.text)({
      hooks: {
        resolveInput: ({ operation, resolvedData, inputData }) => {
          if (operation === "create" && !inputData.title) {
            return resolvedData.file.filename;
          }
          if (operation === "update" && !resolvedData.title) {
            return resolvedData.file.filename;
          }
          return resolvedData.title;
        }
      },
      ui: {
        description: "This field specifies the title of the video, which is automatically generated from the uploaded video URL.",
        itemView: {
          fieldMode: "read"
        }
      }
    }),
    altText: (0, import_fields21.text)({
      validation: { isRequired: true },
      ui: {
        description: "This required field specifies the alternative text for the video. Alt text provides a textual description of the video, which is essential for accessibility and SEO purpose."
      }
    }),
    file: (0, import_fields21.file)({
      storage: "videoStorage"
    }),
    createdAt: (0, import_fields21.timestamp)({ isRequired: true, defaultValue: { kind: "now" } }),
    size: (0, import_fields21.integer)({
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
    thumbnailUrl: (0, import_fields21.text)({}),
    url: (0, import_fields21.text)({
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
var import_core26 = require("@keystone-6/core");
var import_fields22 = require("@keystone-6/core/fields");
var import_core27 = require("@keystone-6/core");
var import_access43 = require("@keystone-6/core/access");
var import_fields_document7 = require("@keystone-6/fields-document");
var testSchema = (0, import_core26.list)({
  access: {
    operation: {
      ...(0, import_access43.allOperations)(isSignedIn),
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
    ...(0, import_core27.group)({
      label: "Sections",
      // description: 'Sections description',
      fields: {
        sections: (0, import_fields22.json)({
          ui: {
            views: "./customViews/fields/AllSectionsField.jsx",
            createView: { fieldMode: "edit" },
            listView: { fieldMode: "hidden" },
            itemView: { fieldMode: "edit", fieldPosition: "form" }
          }
        })
        /* ... */
      }
    })
    // content: document({
    //   layouts: [
    //     [1, 1],
    //     [1, 1, 1],
    //   ],
    //   formatting: {
    //     inlineMarks: {
    //       bold: true,
    //       italic: true,
    //       underline: true,
    //       strikethrough: true,
    //       code: true,
    //       superscript: true,
    //       subscript: true,
    //       keyboard: true,
    //     },
    //     listTypes: {
    //       ordered: true,
    //       unordered: true,
    //     },
    //     alignment: {
    //       center: true,
    //       end: true,
    //     },
    //     headingLevels: [1, 2, 3, 4, 5, 6],
    //     blockTypes: {
    //       blockquote: true,
    //       code: true,
    //     },
    //     softBreaks: true,
    //   },
    // }),
    // testwysiwyg: json({
    //   ui: {
    //     views: './customViews/TestWysiwyg.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    // sections: json({
    //   ui: {
    //     views: './customViews/AllSections.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
    // principles: json({
    //   ui: {
    //     views: './customViews/Principles.jsx',
    //     createView: { fieldMode: 'edit' },
    //     listView: { fieldMode: 'hidden' },
    //     itemView: { fieldMode: 'edit' },
    //   },
    // }),
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
  MainMenu: mainMenuSchema,
  FooterMenu: footerMenuSchema,
  News: newsSchema,
  NewsCategory: newsCategorySchema,
  Resource: resourceSchema,
  ResourceType: resourceTypeSchema,
  Image: imageSchema,
  Video: videoSchema,
  Principle: principleSchema,
  PrincipleNumber: principleNumberSchema,
  PrincipleCategory: principleCategorySchema,
  People: peopleSchema,
  Case: caseSchema,
  Test: testSchema
};

// storage/imageStorage.js
var imageStorage = {
  kind: "s3",
  type: "image",
  bucketName: process.env.BUCKETEER_BUCKET_NAME,
  region: process.env.BUCKETEER_AWS_REGION,
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  pathPrefix: "public/images/"
};

// storage/videoStorage.js
var videoStorage = {
  kind: "s3",
  type: "file",
  pathPrefix: "public/media/",
  bucketName: process.env.BUCKETEER_BUCKET_NAME,
  region: process.env.BUCKETEER_AWS_REGION,
  accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY
};

// storage.js
var storage = {
  imageStorage,
  videoStorage
};

// auth/auth.js
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");

// utils/email.js
var import_nodemailer = __toESM(require("nodemailer"));
var import_pug = __toESM(require("pug"));
var import_html_to_text = require("html-to-text");
var Email = class {
  constructor(fromEmail, mailData, url) {
    this.to = mailData.targetEmail, this.name = mailData.name, this.url = url, this.contactEmail = mailData.contactEmail, this.message = mailData.message, this.linkedIn = mailData.linkedIn, this.usingD4CRGuideAndPrinciples = mailData.usingD4CRGuideAndPrinciples, this.logoFeaturedOnWebpage = mailData.logoFeaturedOnWebpage, this.from = fromEmail;
  }
  newTransport() {
    return import_nodemailer.default.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      // Om i Production-miljö, så ska secure vara true, annars false.
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  // Skickar mailet.
  async send(template, subject) {
    const html = import_pug.default.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
      name: this.name,
      contactEmail: this.contactEmail,
      linkedIn: this.linkedIn,
      message: this.message,
      url: this.url,
      usingD4CRGuideAndPrinciples: this.usingD4CRGuideAndPrinciples,
      logoFeaturedOnWebpage: this.logoFeaturedOnWebpage,
      subject
    });
    const mailOptions = {
      from: this.from,
      // from: process.env.EMAIL_USERNAME,
      to: this.to,
      replyTo: this.contactEmail,
      subject,
      html,
      text: (0, import_html_to_text.htmlToText)(html)
    };
    await this.newTransport().sendMail(mailOptions);
  }
  // Transport
  async sendContactUs() {
    await this.send("contact", "Someone used the contact form!");
  }
  async sendShareStory() {
    await this.send("shareStory", "Someone wants to share a story!");
  }
  async sendJoinSlack() {
    await this.send("slack", "Someone wants to join our Slack!");
  }
  async sendOneTimeAuthenticationLink() {
    await this.send("oneTimeAuth", "One-time authentication link, valid for 10 minutes.");
  }
};

// auth/auth.js
var sessionSecret = process.env.SESSION_SECRET;
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  // Ett identity field på usern.
  identityField: "email",
  secretField: "password",
  magicAuthLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      const fromEmail = process.env.EMAIL_FROM;
      const url = `${process.env.BASE_URL}validate-token?token=${token}&email=${identity}`;
      const mailData = {
        targetEmail: identity
      };
      await new Email(fromEmail, mailData, url).sendOneTimeAuthenticationLink();
    },
    tokensValidForMins: 10
  },
  initFirstItem: {
    fields: ["fullName", "email", "password"],
    // Följande data sparas som default på den första användaren.
    itemData: {
      role: {
        create: {
          name: "Admin Role",
          canCreateItems: true,
          canCreateChapters: true,
          // Ny
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
    fullName
    email
    chapters {
      id
      title
      slug
    }
    role {
      id
      name
      canCreateItems
      canCreateChapters
      canManageAllItems
      canSeeOtherUsers
      canEditOtherUsers
      canManageUsers
      canManageRoles
    }`
});
var session = (0, import_session.statelessSessions)({
  // maxAge: sessionMaxAge,
  maxAge: 60 * 60 * 24 * 30,
  secret: process.env.SESSION_SECRET
});

// utils/fetchFormEmails.js
async function fetchFormEmails() {
  try {
    const response = await fetch(`${process.env.API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: `
          query FormEmail {
            formEmail {
              id
              contactEmail
              joinSlackEmail
              shareStoryEmail
            }
          }
        `
      })
    });
    const responseData = await response.json();
    if (response.ok) {
      return responseData.data.formEmail;
    } else {
      throw new Error(responseData.errors[0].message);
    }
  } catch (error) {
    console.error("Error fetching form email:", error);
    throw error;
  }
}

// routes/sendEmail.js
var sendEmail = async (req, res) => {
  try {
    const targetEmails = await fetchFormEmails();
    const fromEmail = `${process.env.EMAIL_FROM}}`;
    const url = "https://d4cr.com";
    if (!req.body.target) {
      return res.status(400).send({
        success: false,
        message: "Missing or invalid required fields"
      });
    }
    if (req.body.target === "contactus") {
      if (!req.body.name || !req.body.contactEmail || !req.body.message) {
        return res.status(400).send({
          succuess: false,
          message: "Missing or invalid required fields"
        });
      } else {
        const mailData = {
          targetEmail: targetEmails.contactEmail,
          name: req.body.name,
          contactEmail: req.body.contactEmail,
          message: req.body.message
        };
        await new Email(fromEmail, mailData, url).sendContactUs();
      }
    }
    if (req.body.target === "joinslack") {
      if (!req.body.name || !req.body.contactEmail || !req.body.message) {
        res.status(400).send({
          succuess: false,
          message: "Missing or invalid required fields"
        });
      }
      const mailData = {
        targetEmail: targetEmails.joinSlackEmail,
        name: req.body.name,
        linkedIn: req.body.linkedIn ? req.body.linkedIn : "None",
        contactEmail: req.body.contactEmail,
        message: req.body.message
      };
      await new Email(fromEmail, mailData, url).sendJoinSlack();
    }
    if (req.body.target === "shareyourstory") {
      if (!req.body.name || !req.body.contactEmail || !req.body.message || // !req.body.linkedIn ||
      req.body.usingD4CRGuideAndPrinciples === null || req.body.usingD4CRGuideAndPrinciples === void 0 || typeof req.body.usingD4CRGuideAndPrinciples !== "boolean" || req.body.logoFeaturedOnWebpage === null || req.body.logoFeaturedOnWebpage === void 0 || typeof req.body.logoFeaturedOnWebpage !== "boolean") {
        return res.status(400).send({
          succuess: false,
          message: "Missing or invalid required fields"
        });
      }
      const mailData = {
        targetEmail: targetEmails.shareStoryEmail,
        name: req.body.name,
        linkedIn: req.body.linkedIn ? req.body.linkedIn : "None",
        contactEmail: req.body.contactEmail,
        message: req.body.message,
        usingD4CRGuideAndPrinciples: req.body.usingD4CRGuideAndPrinciples,
        logoFeaturedOnWebpage: req.body.logoFeaturedOnWebpage
      };
      await new Email(fromEmail, mailData, url).sendShareStory();
    }
    res.status(200).send({ success: true, message: "Email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
var sendEmail_default = sendEmail;

// routes/validateRecaptcha.js
var validateRecaptcha = async (req, res) => {
  try {
    const { captchaValue } = req.body;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SITE_SECRET}&response=${captchaValue}`,
      { method: "POST" }
    );
    const data = await response.json();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var validateRecaptcha_default = validateRecaptcha;

// keystone.js
import_dotenv.default.config();
var { PORT, MAX_FILE_SIZE, DATABASE_URL, CORS_FRONTEND_ORIGIN } = process.env;
var corsFrontendOriginArray = CORS_FRONTEND_ORIGIN.split(",");
var apiLimiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 15 * 60 * 1e3,
  // 15 minuter
  limit: 2e4,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: "Too many requests, please try again later."
});
var sendEmailLimiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  message: "Too many requests, please try again later."
});
var signInLimiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  message: "Too many requests, please try again later."
});
var keystone_default = withAuth(
  (0, import_core28.config)({
    server: {
      port: PORT,
      maxFileSize: MAX_FILE_SIZE,
      cors: { origin: [corsFrontendOriginArray], credentials: true },
      extendExpressApp: (app, commonContext) => {
        app.use(apiLimiter);
        app.use(import_express.default.json());
        app.post("/api/email", sendEmailLimiter, sendEmail_default);
        app.use("/public", import_express.default.static("public"));
        app.get("/signin", signInLimiter, (req, res) => res.redirect("/sign-in"));
        app.post("/api/validate-recaptcha", validateRecaptcha_default);
      }
    },
    db: {
      provider: "postgresql",
      url: DATABASE_URL,
      idField: { kind: "uuid" }
    },
    lists,
    session,
    storage,
    ui: {
      publicPages: ["/validate-token", "/forgot-password", "/sign-in"]
    }
  })
);
//# sourceMappingURL=config.js.map
