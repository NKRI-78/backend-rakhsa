const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const Admin = require("../models/Admin")
const jwt = require('jsonwebtoken')
const fs = require('fs')
const ExcelJS = require("exceljs");
const User = require("../models/User")


module.exports = {

    remote: async (_, res) => {
        try {
            var remote = await Admin.remote()

            misc.response(res, 200, false, "", remote[0])
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Internal server error")
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body

        try {

            var login = await Admin.login(username)

            if (login.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var user = login[0]

            var passwordHash = await utils.checkPasswordEncrypt(password, user.password)

            if (!passwordHash)
                throw new Error("password tidak sama")

            var payload = {
                uid: user.uid,
                authorized: true
            }

            var token = jwt.sign(payload, process.env.SECRET_KEY)
            var refreshToken = jwt.sign(payload, process.env.SECRET_KEY)

            var emailActivated = user.email_activated == 1 ? true : false
            var phoneActivated = user.phone_activated == 1 ? true : false

            misc.response(res, 200, false, "", {
                token: token,
                refresh_token: refreshToken,
                user: {
                    id: user.uid,
                    avatar: user.avatar ?? "",
                    name: user.fullname,
                    email: user.email,
                    email_activated: emailActivated,
                    phone: user.phone,
                    phone_activated: phoneActivated,
                    role: user.role,
                }
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    memberTable: async (req, res) => {
        const { year } = req.query

        var yearAssign = year

        try {

            if (typeof year == "undefined" || year == "")
                yearAssign = new Date().getFullYear()

            var memberTable = await Admin.memberTable(yearAssign)

            var data = []

            for (var i in memberTable) {
                var member = memberTable[i]

                data.push({
                    fullname: member.fullname,
                    month: member.month_d,
                })
            }

            misc.response(res, 200, false, "", { members: data, count: memberTable.length })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Internal server error")
        }
    },
    
    createCatalogPos: async (req, res) => {
        const { name, img, price, desc, cat_id } = req.body

        try {

            var data = {
                name: name, 
                img: img, 
                desc: desc,
                price: price, 
                cat_id: cat_id
            }

            await User.createCatalogPos(data)

            misc.response(res, 200, false, "", null)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    deleteCatalogPos: async (req, res) => {
        const { id } = req.body
        
        try {

            var data = {
                id: id
            }

            await User.deleteCatalogPos(data)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    },

    updateCatalogPos: async (req, res) => {
        const { name, img, price, desc, cat_id } = req.body

        const { id } = req.params 

        try {

            var data = {
                id: id, 
                name: name, 
                desc: desc,
                img: img, 
                price: price, 
                cat_id: cat_id
            }

            await User.updateCatalogPos(data)

            misc.response(res, 200, false, "", null)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.mssage)
        }
    },

    getCatalogPosById: async (req, res) => {
        const { cat_id } = req.body
        
        try {
            
            var catalogs = await User.getCatalogPosById(cat_id)

            if(catalogs.length == 0)
                throw new Error("Catalog not found")

            var catalog = catalogs[0]

            var categories = await User.getCategoryPosById(catalog.category_id)

            if(categories.length == 0) 
                throw new Error("Category not found")

            var category = categories[0]

            var data = {
                id: catalog.id,
                name: catalog.name,
                img: catalog.img,
                price: catalog.price, 
                desc: catalog.desc,
                category: {
                    id: category.id,
                    name: category.name
                },
                created_at: catalog.created_at
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getCategoryPos: async (req, res) => {
        try {
            var categories = await User.getCategoryPos()

            misc.response(res, 200, false, "", categories)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getCatalogPosCategoryById: async (req, res) => {
        const { cat_id } = req.body 

        try {

            var categories = await User.getCategoryPosById(cat_id)

            if(categories.length == 0)
                throw new Error("Category not found")

            var category = categories[0]

            var catalogAssign = []

            var catalogs = await User.getCatalogPosByCategoryId(category.id)

            for (const z in catalogs) {
                var catalogData = catalogs[z]

                catalogAssign.push({
                    id: catalogData.id,
                    name: catalogData.name,
                    img: catalogData.img, 
                    price: catalogData.price, 
                    desc: catalogData.desc,
                    category: {
                        id: category.id,
                        category: category.name,
                    }
                })
            }

            var data = {
                id: category.id,
                category: category.name,
                catalogs: catalogAssign
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    insertOrderPos: async (req, res) => {
        const { cat_id, total_qty, total_price } = req.body

        try {
            
            var orderId = utils.generateId(8)

            for (const i in cat_id) {
                await User.insertOrderPos(
                    orderId, 
                    parseInt(cat_id[i].id), 
                    parseInt(cat_id[i].qty)
                )
            }

            await User.insertOrderPosDetail(orderId, total_qty, total_price)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getSelectProvincePos: async (_, res) => {
        try {

            var provinces = await User.getProvincePos()

            misc.response(res, 200, false, "", provinces)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getSelectCityPos: async (req, res) => {
        const { province_id } = req.body

        try {

            var cities = await User.getCityPos(province_id)

            misc.response(res, 200, false, "", cities)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getOrderPos: async (_, res) => {
        try {

            var data = []

            var orders = await User.getOrderPos()

            var orderDetailsArr = []

            for (const i in orders) {
                var order = orders[i]

                var orderDetails = await User.getOrderPosDetail(order.order_id)

                orderDetailsArr.push(orderDetails)

                data.push({
                    id: order.id,
                    name: order.name,
                    img: order.img, 
                    price: order.price,
                    qty: order.qty
                })
            }

            misc.response(res, 200, false, "", {
                products: data,
                order: orderDetailsArr.length == 0 
                ? {
                    total_qty: 0,
                    total_price: 0,
                }
                : orderDetailsArr[0][0]
            })

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    addToCartPos: async (req, res) => {
        const { cat_id, qty } = req.body

        try {

            await User.addToCartPos(cat_id, qty)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    },

    deleteCartPosById: async (req, res) => {
        const { cat_id } = req.body

        try {

            await User.deleteCartPos(cat_id)

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    },

    clearCartPos: async (_, res) => {
        try {

            await User.clearCartPos()

            misc.response(res, 200, false, "", null)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    },

    getPosCart: async (_, res) => {
        try {

            var carts = await User.getPosCart()

            misc.response(res, 200, false, "", carts)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getMember: async (_, res) => {
        try {

            var { search } = _.query;

            var members = await Admin.getMember(search)

            var data = []

            for (var i in members) {
                var member = members[i]

                data.push({
                    id: member.user_id,
                    fullname: member.fullname,
                    email: member.email,
                    phone: member.phone,
                    no_member: member.no_member,
                    address: member.address_ktp,
                    organization: member.organization_name,
                    job: member.job_name,
                    reminder_date: member.reminder_date == null
                        ? "-"
                        : member.reminder_date == ""
                            ? "-"
                            : utils.formatDateByName(member.reminder_date),
                    link_user: member.link_user ?? null,
                    created_at: member.created_at
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },
    memberToExcel: async (_, res) => {
        try {

            var { search } = _.query;

            var members = await Admin.getMember(search)

            var data = []

            for (var i in members) {
                var member = members[i]

                data.push({
                    id: member.user_id,
                    fullname: member.fullname,
                    email: member.email,
                    phone: member.phone,
                    no_member: member.no_member,
                    address: member.address_ktp,
                    organization: member.organization_name,
                    job: member.job_name,
                    reminder_date: member.reminder_date == null
                        ? "-"
                        : member.reminder_date == ""
                            ? "-"
                            : utils.formatDateByName(member.reminder_date),
                    link_user: member.link_user ?? null
                })
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Member Data", {
                pageSetup: { paperSize: 9, orientation: "landscape" },
            });

            // Initialize the row index
            let rowIndex = 2;

            let row = worksheet.getRow(rowIndex);
            row.values = ["No", "Nama", "Referensi", "Nomor Anggota", "Masa Aktif", "Email", "Telpon", "Organisasi", "Profesi", "Alamat"];
            row.font = { bold: true };

            const columnWidths = [5, 20, 20, 20, 20, 20, 20, 20, 20, 50];

            row.eachCell((cell, colNumber) => {
                const columnIndex = colNumber - 1;
                const columnWidth = columnWidths[columnIndex];
                worksheet.getColumn(colNumber).width = columnWidth;
            });

            // Loop over the grouped data
            data.forEach((member, index) => {
                const row = worksheet.getRow(rowIndex + index + 1);
                row.getCell("A").value = index + 1;
                row.getCell("B").value = member.fullname;
                row.getCell("C").value = member.link_user;
                row.getCell("D").value = member.no_member;
                row.getCell("E").value = member.reminder_date;
                row.getCell("F").value = member.email;
                row.getCell("G").value = member.phone;
                row.getCell("H").value = member.organization;
                row.getCell("I").value = member.job;
                row.getCell("J").value = member.address;

                row.getCell("B").alignment = { wrapText: true };
            });
            // Increment the row index
            rowIndex += data.length;

            // Merge cells for the logo
            worksheet.mergeCells(
                `A1:${String.fromCharCode(65 + worksheet.columns.length - 1)}1`
            );


            worksheet.getRow(1).height = 40;


            // Define the border style
            const borderStyle = {
                style: "thin", // You can use 'thin', 'medium', 'thick', or other valid styles
                color: { argb: "00000000" },
            };

            // Loop through all cells and apply the border style
            worksheet.eachRow((row, rowNumber) => {
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    cell.border = {
                        top: borderStyle,
                        bottom: borderStyle,
                    };
                });
            });

            const date = Date.now();
            // Generate the XLS file
            const file = await workbook.xlsx.writeBuffer();
            await fs.promises.mkdir(`${process.cwd()}/public/member-excel`, { recursive: true })
            fs.writeFileSync(`${process.cwd()}/public/member-excel/${date}.xlsx`, file)
            misc.response(res, 200, false, "", { path: `${process.env.BASE_URL}/member-excel/${date}.xlsx` })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    summary: async (_, res) => {
        try {
            var totalUserRegisteredByMonth = await Admin.totalUserRegisteredByMonth()
            var totalUserPlatinumByMonth = await Admin.totalUserPlatinumByMonth()
            var totalUserMemberByMonth = await Admin.totalUserMemberByMonth()

            var dataTypeUserMember = await Admin.dataTypeUser('MEMBER')
            var dataTypeUserPlatinum = await Admin.dataTypeUser('PLATINUM')

            var dataUserMember = []
            for (var i in dataTypeUserMember) {
                dataUserMember.push({
                    name: dataTypeUserMember[i].fullname,
                    email: dataTypeUserMember[i].email,
                    phone: dataTypeUserMember[i].phone
                })
            }

            var dataUserPlatinum = []
            for (var i in dataTypeUserPlatinum) {
                dataUserPlatinum.push({
                    name: dataTypeUserPlatinum[i].fullname,
                    email: dataTypeUserPlatinum[i].email,
                    phone: dataTypeUserPlatinum[i].phone
                })
            }

            var totalUserRegisteredByMonthAssign = []
            for (var i in totalUserRegisteredByMonth) {
                totalUserRegisteredByMonthAssign.push({
                    month: utils.formatDate(totalUserRegisteredByMonth[i].created_at),
                    count: totalUserRegisteredByMonth[i].count,
                })
            }

            var totalUserPlatinumByMonthAssign = []
            for (var i in totalUserPlatinumByMonth) {
                totalUserPlatinumByMonthAssign.push({
                    month: utils.formatDate(totalUserPlatinumByMonth[i].created_at),
                    count: totalUserPlatinumByMonth[i].count,
                })
            }

            var totalUserMemberByMonthAssign = []
            for (var i in totalUserMemberByMonth) {
                totalUserMemberByMonthAssign.push({
                    month: utils.formatDate(totalUserMemberByMonth[i].created_at),
                    count: totalUserMemberByMonth[i].count,
                })
            }

            misc.response(res, 200, false, "", {
                total_user_member: totalUserMemberByMonthAssign,
                total_user_platinum: totalUserPlatinumByMonthAssign,
                total_user_registered: totalUserRegisteredByMonthAssign,
                user_member: dataUserMember,
                user_platinum: dataUserPlatinum,
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    checkins: async (req, res) => {
        try {
            var checkins = await Admin.checkins();

            var uids = checkins.map((e) => e.uid)

            var joins = await Admin.checkinJoin(uids)

            var d_checkins = []

            for (const index in checkins) {
                if (Object.hasOwnProperty.call(checkins, index)) {
                    const checkin = checkins[index];

                    d_checkins[index] = {
                        ...checkin,
                        members: joins.filter((e) => e.uid == checkin.uid).map((e) => e)
                    }

                }
            }


            misc.response(res, 200, true, "OKE", d_checkins)
        } catch (error) {
            console.log(error)
            misc.response(res, 400, true, "Server error")
        }
    },

    checkinDetail: async (req, res) => {
        try {

            var id = req.params.id;

            var checkins = await Admin.checkinDetail(id);

            if (checkins.length == 0) {
                throw new Error('NOT FOUND');
            }

            var uids = checkins.map((e) => e.uid)

            var joins = await Admin.checkinJoin(uids)

            var d_checkins = []

            for (const index in checkins) {
                if (Object.hasOwnProperty.call(checkins, index)) {
                    const checkin = checkins[index];

                    d_checkins[index] = {
                        ...checkin,
                        members: joins.filter((e) => e.uid == checkin.uid).map((e) => e)
                    }

                }
            }

            misc.response(res, 200, true, "OKE", d_checkins[0])
        } catch (error) {
            console.log(error)
            misc.response(res, 400, true, error.message)
        }
    },

    revenue: async (req, res) => {
        const { month } = req.query

        try {

            var revenueTotal = await Admin.revenueTotal()
            var revenues = await Admin.revenue(month)

            var data = {}

            var amount = 0

            var dataUsers = []
            var dataUsersFixed = []
            for (i in revenues) {
                var revenue = revenues[i]

                dataUsers.push({
                    fullname: revenue.fullname,
                    email: revenue.email,
                    phone: revenue.phone,
                    created_at: utils.formatDateWithSeconds(revenue.created_at)
                })
            }

            for (i in revenueTotal) {
                var revenueT = revenueTotal[i]

                dataUsersFixed.push({
                    fullname: revenueT.fullname,
                    email: revenueT.email,
                    phone: revenueT.phone
                })

                amount += parseInt(revenueT.amount)
            }

            data.amount = utils.convertRp(amount)

            misc.response(res, 200, false, "", {
                users: dataUsers,
                total_user: dataUsersFixed.length,
                amount: data.amount
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    getMemberReport: async (_, res) => {
        try {

            var { search } = _.query;

            var toExcel = _.query.to_excel ?? 0;

            var members = await Admin.getMemberReport(search)

            var path = '';

            if (toExcel == 1) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("Member Reports", {
                    pageSetup: { paperSize: 9, orientation: "landscape" },
                });
                // Initialize the row index
                let rowIndex = 2;
                let row = worksheet.getRow(rowIndex);
                row.values = ["No", "Nama", "Email", "Phone", "No KTP", "Alamat", "Provinsi", "Kota", "Nama Lembaga", "Bentuk Usaha", "Klasifikasi Usaha", "Jumlah Karyawan", "Tanggal Dibuat"];
                row.font = { bold: true };
                const columnWidths = [5, 20, 20, 20, 20, 20, 20, 40, 40, 40, 40, 10, 20];
                row.eachCell((cell, colNumber) => {
                    const columnIndex = colNumber - 1;
                    const columnWidth = columnWidths[columnIndex];
                    worksheet.getColumn(colNumber).width = columnWidth;
                });

                members.forEach((member, index) => {
                    const row = worksheet.getRow(rowIndex + index + 1);
                    row.getCell("A").value = index + 1;
                    row.getCell("B").value = member.fullname;
                    row.getCell("C").value = member.email;
                    row.getCell("D").value = member.phone;
                    row.getCell("E").value = member.no_ktp;
                    row.getCell("F").value = member.address_ktp;
                    row.getCell("G").value = member.province ?? "";
                    row.getCell("H").value = member.city ?? "";
                    row.getCell("I").value = member.name_instance ?? "";
                    row.getCell("J").value = member.business_name ?? "";
                    row.getCell("K").value = member.classification_name ?? "";
                    row.getCell("L").value = member.employee_count ?? 0;
                    row.getCell("M").value = member.created_at;
                })

                // Increment the row index
                rowIndex += members.length;

                // Merge cells for the logo
                worksheet.mergeCells(
                    `A1:${String.fromCharCode(65 + worksheet.columns.length - 1)}1`
                );

                worksheet.getRow(1).height = 40;

                // Define the border style
                const borderStyle = {
                    style: "thin", // You can use 'thin', 'medium', 'thick', or other valid styles
                    color: { argb: "00000000" },
                };

                // Loop through all cells and apply the border style
                worksheet.eachRow((row, rowNumber) => {
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        cell.border = {
                            top: borderStyle,
                            bottom: borderStyle,
                        };
                    });
                });

                const date = Date.now();
                // Generate the XLS file
                const file = await workbook.xlsx.writeBuffer();
                await fs.promises.mkdir(`${process.cwd()}/public/member-reports`, { recursive: true })
                fs.writeFileSync(`${process.cwd()}/public/member-reports/${date}.xlsx`, file)
                path = `${process.env.BASE_URL}/member-reports/${date}.xlsx`
            }

            misc.response(res, 200, false, "", toExcel == 1 ? {
                path: path
            } : members)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },
}