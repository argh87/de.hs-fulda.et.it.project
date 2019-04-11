package de.hsfulda.et.wbs.repository;

import de.hsfulda.et.wbs.core.data.BenutzerData;
import de.hsfulda.et.wbs.entity.Benutzer;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BenutzerRepository extends CrudRepository<Benutzer, Long> {

    @Query("select b from Benutzer b where b.username = :username and b.aktiv = true")
    BenutzerData findByUsername(@Param("username") String username);

    @Query("select b from Benutzer b where b.id = :id")
    Optional<BenutzerData> findByIdAsData(@Param("id") Long id);

    @Query("select b from Benutzer b join b.traeger t where t.id = :traegerId and b.aktiv = true")
    List<BenutzerData> findAllByTraegerId(@Param("traegerId") Long traegerId);

    @Modifying(clearAutomatically = true)
    @Query("update Benutzer b set b.einkaeufer = :einkaeufer, b.mail = :mail where b.id = :id")
    void updateEinkaeuferAndMail(@Param("id") Long id, @Param("einkaeufer") Boolean einkaeufer, @Param("mail") String mail);

    @Modifying
    @Query("update Benutzer b set b.aktiv = false where id = :id")
    void deactivate(@Param("id") Long id);
}
