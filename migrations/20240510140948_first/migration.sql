-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL,
    "role" UUID,
    "magicAuthToken" TEXT,
    "magicAuthIssuedAt" TIMESTAMP(3),
    "magicAuthRedeemedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "canCreateItems" BOOLEAN NOT NULL DEFAULT false,
    "canCreateChapters" BOOLEAN NOT NULL DEFAULT false,
    "canManageAllItems" BOOLEAN NOT NULL DEFAULT false,
    "canSeeOtherUsers" BOOLEAN NOT NULL DEFAULT false,
    "canEditOtherUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageUsers" BOOLEAN NOT NULL DEFAULT false,
    "canManageRoles" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "preamble" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "heroImage" JSONB,
    "chapterLanguage" TEXT DEFAULT 'EN-GB',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sections" JSONB,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "heroPreamble" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "ctaOneAnchorText" TEXT NOT NULL DEFAULT '',
    "ctaOneUrl" JSONB,
    "ctaTwoUrlAnchorText" TEXT NOT NULL DEFAULT '',
    "ctaTwoUrl" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sections" JSONB,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrontPage" (
    "id" INTEGER NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT '',
    "heroPreamble" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "heroVideo" JSONB,
    "ctaOneAnchorText" TEXT NOT NULL DEFAULT '',
    "ctaOneUrl" JSONB,
    "ctaTwoUrlAnchorText" TEXT NOT NULL DEFAULT '',
    "ctaTwoUrl" JSONB,
    "sections" JSONB,

    CONSTRAINT "FrontPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterBanner" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "preamble" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',

    CONSTRAINT "FooterBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormEmail" (
    "id" INTEGER NOT NULL,
    "contactEmail" TEXT NOT NULL DEFAULT '',
    "shareStoryEmail" TEXT NOT NULL DEFAULT '',
    "joinSlackEmail" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FormEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterJoinUs" (
    "id" INTEGER NOT NULL,
    "url1" TEXT NOT NULL DEFAULT '',
    "icon1" JSONB,
    "url2" TEXT NOT NULL DEFAULT '',
    "icon2" JSONB,
    "url3" TEXT NOT NULL DEFAULT '',
    "icon3" JSONB,
    "url4" TEXT NOT NULL DEFAULT '',
    "icon4" JSONB,

    CONSTRAINT "FooterJoinUs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MainMenu" (
    "id" INTEGER NOT NULL,
    "navigation" JSONB,
    "ctaAnchorText" TEXT NOT NULL DEFAULT '',
    "ctaUrl" JSONB,

    CONSTRAINT "MainMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterMenu" (
    "id" INTEGER NOT NULL,
    "navigation" JSONB,

    CONSTRAINT "FooterMenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "newsCategory" UUID,
    "image" JSONB,
    "sections" JSONB,
    "resourcesTitle" TEXT NOT NULL DEFAULT '',
    "resourcesPreamble" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'draft',

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsCategory" (
    "id" UUID NOT NULL,
    "categoryTitle" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "image" JSONB,
    "resourceType" UUID,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceType" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "icon" JSONB,

    CONSTRAINT "ResourceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "altText" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_extension" TEXT,
    "file_width" INTEGER,
    "file_height" INTEGER,
    "file_id" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "altText" TEXT NOT NULL DEFAULT '',
    "file_filesize" INTEGER,
    "file_filename" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "size" INTEGER,
    "thumbnailUrl" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Principle" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "slug" TEXT NOT NULL DEFAULT '',
    "subHeader" TEXT NOT NULL DEFAULT '',
    "quote" TEXT NOT NULL DEFAULT '',
    "quoteAuthor" TEXT NOT NULL DEFAULT '',
    "image" JSONB,
    "subPrinciples" JSONB,
    "resourcesTitle" TEXT NOT NULL DEFAULT '',
    "resourcesPreamble" TEXT NOT NULL DEFAULT '',
    "principleCategory" UUID,
    "principleNumber" UUID,
    "status" TEXT NOT NULL DEFAULT 'draft',

    CONSTRAINT "Principle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrincipleNumber" (
    "id" UUID NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "PrincipleNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrincipleCategory" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrincipleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "People" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT '',
    "image" JSONB,
    "socialMediaUrl1" TEXT NOT NULL DEFAULT '',
    "socialMediaIcon1" JSONB,
    "socialMediaUrl2" TEXT NOT NULL DEFAULT '',
    "socialMediaIcon2" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "People_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "linkType" TEXT DEFAULT 'internal',
    "url" TEXT NOT NULL DEFAULT '',
    "preamble" JSONB NOT NULL DEFAULT '[{"type":"paragraph","children":[{"text":""}]}]',
    "caseImage" JSONB,
    "quote" TEXT NOT NULL DEFAULT '',
    "sections" JSONB,
    "resourcesTitle" TEXT NOT NULL DEFAULT '',
    "resourcesPreamble" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" UUID NOT NULL,
    "sections" JSONB,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Chapter_contentOwner" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Chapter_translatedChapters" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_News_relatedChapters" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_News_resources" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Principle_resources" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_Case_resources" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_slug_key" ON "Chapter"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_title_key" ON "News"("title");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_newsCategory_idx" ON "News"("newsCategory");

-- CreateIndex
CREATE UNIQUE INDEX "NewsCategory_categoryTitle_key" ON "NewsCategory"("categoryTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_title_key" ON "Resource"("title");

-- CreateIndex
CREATE INDEX "Resource_resourceType_idx" ON "Resource"("resourceType");

-- CreateIndex
CREATE UNIQUE INDEX "Principle_slug_key" ON "Principle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Principle_principleNumber_key" ON "Principle"("principleNumber");

-- CreateIndex
CREATE INDEX "Principle_principleCategory_idx" ON "Principle"("principleCategory");

-- CreateIndex
CREATE UNIQUE INDEX "PrincipleNumber_number_key" ON "PrincipleNumber"("number");

-- CreateIndex
CREATE UNIQUE INDEX "PrincipleCategory_title_key" ON "PrincipleCategory"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_Chapter_contentOwner_AB_unique" ON "_Chapter_contentOwner"("A", "B");

-- CreateIndex
CREATE INDEX "_Chapter_contentOwner_B_index" ON "_Chapter_contentOwner"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Chapter_translatedChapters_AB_unique" ON "_Chapter_translatedChapters"("A", "B");

-- CreateIndex
CREATE INDEX "_Chapter_translatedChapters_B_index" ON "_Chapter_translatedChapters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_News_relatedChapters_AB_unique" ON "_News_relatedChapters"("A", "B");

-- CreateIndex
CREATE INDEX "_News_relatedChapters_B_index" ON "_News_relatedChapters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_News_resources_AB_unique" ON "_News_resources"("A", "B");

-- CreateIndex
CREATE INDEX "_News_resources_B_index" ON "_News_resources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Principle_resources_AB_unique" ON "_Principle_resources"("A", "B");

-- CreateIndex
CREATE INDEX "_Principle_resources_B_index" ON "_Principle_resources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Case_resources_AB_unique" ON "_Case_resources"("A", "B");

-- CreateIndex
CREATE INDEX "_Case_resources_B_index" ON "_Case_resources"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_newsCategory_fkey" FOREIGN KEY ("newsCategory") REFERENCES "NewsCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_resourceType_fkey" FOREIGN KEY ("resourceType") REFERENCES "ResourceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Principle" ADD CONSTRAINT "Principle_principleCategory_fkey" FOREIGN KEY ("principleCategory") REFERENCES "PrincipleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Principle" ADD CONSTRAINT "Principle_principleNumber_fkey" FOREIGN KEY ("principleNumber") REFERENCES "PrincipleNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chapter_contentOwner" ADD CONSTRAINT "_Chapter_contentOwner_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chapter_contentOwner" ADD CONSTRAINT "_Chapter_contentOwner_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chapter_translatedChapters" ADD CONSTRAINT "_Chapter_translatedChapters_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Chapter_translatedChapters" ADD CONSTRAINT "_Chapter_translatedChapters_B_fkey" FOREIGN KEY ("B") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_News_relatedChapters" ADD CONSTRAINT "_News_relatedChapters_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_News_relatedChapters" ADD CONSTRAINT "_News_relatedChapters_B_fkey" FOREIGN KEY ("B") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_News_resources" ADD CONSTRAINT "_News_resources_A_fkey" FOREIGN KEY ("A") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_News_resources" ADD CONSTRAINT "_News_resources_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Principle_resources" ADD CONSTRAINT "_Principle_resources_A_fkey" FOREIGN KEY ("A") REFERENCES "Principle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Principle_resources" ADD CONSTRAINT "_Principle_resources_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Case_resources" ADD CONSTRAINT "_Case_resources_A_fkey" FOREIGN KEY ("A") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Case_resources" ADD CONSTRAINT "_Case_resources_B_fkey" FOREIGN KEY ("B") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
