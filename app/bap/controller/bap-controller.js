/**
 * @license Ulakbus-UI
 * Copyright (C) 2015 ZetaOps Inc.
 *
 * This file is licensed under the GNU General Public License v3
 * (GPLv3).  See LICENSE.txt for details.
 */

'use strict';
angular.module('ulakbusBap')

    .controller('DashboardController', function ($scope, $location) {
        $scope.user_ready = true;
        //this will be API call in controller load
        $scope.dashboardData = {
            "menu": {
                "title": "Menü",
                "items": [
                    {
                        "text": "Anasayfa",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_anasayfa"
                    },
                    {
                        "text": "Projeler",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_projeler"
                    },
                    {
                        "text": "Yardım",
                        "hasChild": false,
                        "param": "id",
                        "wf": "yardım"
                    },
                    {
                        "text": "Belgeler",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_belgeler"
                    },
                    {
                        "text": "Mevzuat",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_mevzuat"
                    },
                    {
                        "text": "BAP Komisyonu",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_komisyon_uyeleri"
                    },
                    {
                        "text": "BAP Hakkında",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_hakkinda"
                    },
                    {
                        "text": "BAP Raporları",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_raporlar"
                    },
                    {
                        "text": "İletişim",
                        "hasChild": false,
                        "param": "id",
                        "wf": "bap_iletisim"
                    }
                ]
            },
            "top_action_buttons": [
                {
                    "text": "Yeni Başvuru",
                    "param": "id",
                    "wf": "bap_proje_basvuru"
                },
                {
                    "text": "Başvurum Ne Durumda",
                    "param": "id",
                    "wf": "bap_ogretim_uyesi_basvuru_listeleme"
                },
                {
                    "text": "Makina, Teçhizat Ara",
                    "param": "id",
                    "wf": "demirbas"
                },
                {
                    "text": "Proje Arşivi Ara",
                    "param": "id",
                    "wf": "bap_proje_arama"
                },
                {
                    "text": "Firma Kayıt",
                    "param": "id",
                    "wf": "bap_firma_kayit"
                }
            ],
            "bidding": {
                "announcements": [
                    {
                        "text": "ANNOUNCEMENT_TITLE",
                        "object_id": "OBJECT_ID",
                        "wf": "WORKFLOW_SHOW_ANNOUNCEMENT"
                    }
                ],
                "more": {
                    "text": "Daha Fazla...",
                    "wf": "bap_satin_alma_duyurulari"
                }
            },
            "general": {
                "announcements": [
                    {
                        "text": "ANNOUNCEMENT_TITLE",
                        "object_id": "OBJECT_ID",
                        "wf": "WORKFLOW_SHOW_ANNOUNCEMENT"
                    }
                ],
                "more": {
                    "text": "Daha Fazla...",
                    "wf": "bap_duyurulari"
                }
            },
            "university_title": "UNIVERSITY_TITLE",
            "university_logo": "https://rlv.zcache.co.uk/your_business_logo_here_promo_square_sticker-r40b7af4878d041de9c9dbd2043be51c0_v9wf3_8byvr_324.jpg"
    };

        $scope.clickAnnouncement = function (announcement) {
            $location.path("/"+announcement.wf);
        };

        $scope.clickMore = function (workFlow) {
            $location.path("/"+workFlow);
        };
    });