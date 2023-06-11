public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [SELECT Id, Name, Industry, Type FROM Account];
    }
    @AuraEnabled
    public static void deleteAccount(Id accountId) {
        Account accountToDelete = new Account(Id = accountId);
        delete accountToDelete;
    }
}