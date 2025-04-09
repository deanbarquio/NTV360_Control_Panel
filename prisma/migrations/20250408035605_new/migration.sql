-- CreateTable
CREATE TABLE `Test` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `User_Id` VARCHAR(191) NOT NULL,
    `User_FName` VARCHAR(200) NOT NULL,
    `User_LName` VARCHAR(200) NOT NULL,
    `User_Email` VARCHAR(200) NOT NULL,
    `User_Role` VARCHAR(200) NOT NULL,
    `User_Password` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `User_User_Email_key`(`User_Email`),
    PRIMARY KEY (`User_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feature_Flag` (
    `Feature_Id` VARCHAR(191) NOT NULL,
    `Feature_Name` VARCHAR(200) NOT NULL,
    `Feature_Desc` VARCHAR(200) NOT NULL,
    `Feature_Status` BOOLEAN NOT NULL,
    `Date_Created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `is_Deleted` BOOLEAN NULL DEFAULT false,
    `Feature_JiraNo` VARCHAR(50) NULL,

    PRIMARY KEY (`Feature_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Flag_Assignment` (
    `Assignment_Id` VARCHAR(191) NOT NULL,
    `User_Id` VARCHAR(50) NOT NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT false,
    `Date_Created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Features_Id` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`Assignment_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audit_Logs` (
    `Log_Id` VARCHAR(191) NOT NULL,
    `User_Id` VARCHAR(50) NOT NULL,
    `Features_Id` VARCHAR(50) NOT NULL,
    `Log_Activity` VARCHAR(200) NOT NULL,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`Log_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Flag_Assignment` ADD CONSTRAINT `Flag_Assignment_User_Id_fkey` FOREIGN KEY (`User_Id`) REFERENCES `User`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Flag_Assignment` ADD CONSTRAINT `Flag_Assignment_Features_Id_fkey` FOREIGN KEY (`Features_Id`) REFERENCES `Feature_Flag`(`Feature_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audit_Logs` ADD CONSTRAINT `Audit_Logs_User_Id_fkey` FOREIGN KEY (`User_Id`) REFERENCES `User`(`User_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audit_Logs` ADD CONSTRAINT `Audit_Logs_Features_Id_fkey` FOREIGN KEY (`Features_Id`) REFERENCES `Feature_Flag`(`Feature_Id`) ON DELETE CASCADE ON UPDATE CASCADE;
