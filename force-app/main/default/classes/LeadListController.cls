public with sharing class LeadListController {

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
        return [SELECT Id, Name, Company, Email, Phone, Status, Rating, Industry FROM Lead];
    }

    @AuraEnabled
    public static void updateLead(List<Lead> leads) {
        update leads;
    }

    @AuraEnabled
    public static void deleteLead(List<Lead> leads) {
        delete leads;
    }
}