var socket = io();
socket.emit("login", document.cookie);

function activateModal_New() {
    var e = document.createElement("div");
    $(e).addClass("mui-panel");
    $(e).addClass("popup");
    $('<form method="post" action="/hosts">  <legend>\u65b0\u5efa\u9879\u76ee</legend>  <div class="mui-form-group">    <input type="text" name="title" class="mui-form-control" placeholder="title">  </div>  <div class="mui-form-group"><input type="url" name="url" class="mui-form-control" placeholder="url"></div>  <iframe height="50px" frameborder="0" name="upload" src="' + location.origin + '/hosts/upload"></iframe><div class="mui-checkbox">    <label>      <input name="lock" type="checkbox">\u79c1\u6709    </label>  </div>  <div class="mui-form-group">    <textarea name="description" class="mui-form-control" placeholder="description"></textarea>  </div>  <button type="submit" class="mui-btn mui-btn-default mui-btn-raised">\u65b0\u5efa</button></form>').appendTo(e);
    mui.overlay("on", e)
}

function activateModal_Detail(e) {
    var t = document.createElement("div");
    $(t).addClass("spinner");
    $('<div class="dot1"></div><div class="dot2"></div>').appendTo(t);
    mui.overlay("on", t);
    socket.emit("Hosts", "get", {
        id: e
    }, function(e, t) {
        mui.overlay("off");
        if (e) {
            e.level = "danger";
            showLog(e);
            return
        }
        var n = document.createElement("div");
        $(n).addClass("mui-panel");
        $(n).addClass("popup");
        $(n).addClass("lg");
        var o = false;
        if (t.author && t.author.objectId === User.objectId) {
            o = true
        }
        $('<form method="post" action="/hosts' + (o ? "/" : "?fork=") + t.objectId + '"><legend>' + t.title + (o ? '<i class="fa fa-pencil-square-o"></i>' + (t.fork && t.fork.objectId ? "<a href=\"javascript:activateModal_Detail('" + t.fork.objectId + '\')" title="" style="float: right;"><i class="fa fa-code-fork"></i></a>' : "") : '<i class="fa fa-clone"></i>') + '</legend><div class="mui-form-group">' + '<input type="text" name="title" class="mui-form-control" placeholder="title" value="' + t.title + '"></div><div class="mui-form-group"><input type="url" name="url" class="mui-form-control" placeholder="url" value="' + t.url + '"></div><iframe height="50px" frameborder="0" name="upload" src="' + location.origin + '/hosts/upload"></iframe><div class="mui-checkbox"><label><input name="lock" type="checkbox" ' + (o & t.lock ? "checked" : "") + '>\u79c1\u6709</label></div><div class="mui-form-group"><textarea name="description" class="mui-form-control" placeholder="description">' + t.description + '</textarea>  </div>  <button type="submit" class="mui-btn mui-btn-default mui-btn-raised">' + (o ? "\u4fee\u6539" : "\u6536\u85cf\u5230\u5e93") + "</button>" + (o ? "<a href=\"javascript:hosts_remove('" + t.objectId + '\')" title="">  Delete</a>' : "") + "</form>").appendTo(n);
        mui.overlay("on", n)
    })
}
socket.on("login", function(e, t) {
    if (e) {
        e.level = "danger";
        showLog(e);
        return
    }
    console.log("login", e, t)
});
socket.on("logout", function(e, t) {
    if (e) {
        e.level = "danger";
        showLog(e);
        return
    }
    console.log("logout", e, t)
});

function hosts_remove(e) {
    var t = document.createElement("div");
    $(t).addClass("spinner");
    $('<div class="dot1"></div><div class="dot2"></div>').appendTo(t);
    mui.overlay("on", t);
    socket.emit("Hosts", "del", {
        id: e
    }, function(e, t) {
        mui.overlay("off");
        if (e) {
            e.level = "danger";
            showLog(e);
            return
        }
        $('div[name="' + t["objectId"] + '"]').remove()
    });
}(function() {
    var e = AV.push({
        appId: appId,
        appKey: appKey
    });
    e.open(function() {
        console.log("\u5f00\u542f\u63a5\u6536\u63a8\u9001")
    });
    e.on("message", function(e) {
        console.log(e)
        showLog(e)
    });
    window.send = function(t) {
        e.send({
            username: User.username,
            level: "primary",
            msg: t
        }, function(e) {
            if (e) {
                console.log("\u63a8\u9001\u6210\u529f\u53d1\u9001")
            } else {
                console.log({
                    level: "danger",
                    msg: "\u63a8\u9001\u53d1\u9001\u5931\u8d25"
                })
            }
        })
    };
    $("#talk_input").bind("keypress", function(e) {
        if (e.keyCode == "13" && this.value.length > 0) {
            t(this.value);
            this.value = ""
        }
    })
})();
$("#msg_send").mousemove(function() {
    $(this).removeClass("mui-btn-danger")
});